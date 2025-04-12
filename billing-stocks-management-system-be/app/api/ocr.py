from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import OCRScan
from app import db
import os
import json
import uuid
from datetime import datetime
from PIL import Image
import pytesseract
from google.cloud import vision
from google.cloud import translate_v2 as translate

ocr_bp = Blueprint('ocr', __name__)

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Helper function to save uploaded file
def save_file(file):
    """Save uploaded file and return filename"""
    filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    return filename, file_path


# Helper function for OCR using Tesseract
def process_with_tesseract(file_path):
    """Process image with Tesseract OCR"""
    try:
        # Open image with PIL
        image = Image.open(file_path)
        
        # Perform OCR
        text = pytesseract.image_to_string(image)
        
        # Extract data (basic implementation)
        # In a real app, you'd use more sophisticated parsing
        lines = text.split('\n')
        data = {
            'raw_text': text,
            'items': [],
            'total': None,
            'date': None,
            'invoice_number': None
        }
        
        # Simple parsing logic (would need to be enhanced for real use)
        for line in lines:
            if 'total' in line.lower() and any(c.isdigit() for c in line):
                # Extract total amount
                data['total'] = ''.join(c for c in line if c.isdigit() or c == '.')
            elif 'date' in line.lower() or 'dt' in line.lower():
                # Extract date
                data['date'] = line
            elif 'invoice' in line.lower() or 'bill' in line.lower():
                # Extract invoice number
                data['invoice_number'] = line
            elif any(c.isdigit() for c in line) and 'rs' in line.lower():
                # This might be an item with price
                data['items'].append(line)
        
        return data
    
    except Exception as e:
        return {'error': str(e)}


# Helper function for OCR using Google Cloud Vision
def process_with_google_vision(file_path):
    """Process image with Google Cloud Vision API"""
    try:
        # Initialize Google Cloud Vision client
        client = vision.ImageAnnotatorClient()
        
        # Read file
        with open(file_path, 'rb') as image_file:
            content = image_file.read()
        
        # Create image object
        image = vision.Image(content=content)
        
        # Perform text detection
        response = client.text_detection(image=image)
        texts = response.text_annotations
        
        if not texts:
            return {'error': 'No text detected'}
        
        # Extract full text
        full_text = texts[0].description
        
        # Process text to extract structured data
        # This is a simplified implementation
        lines = full_text.split('\n')
        data = {
            'raw_text': full_text,
            'items': [],
            'total': None,
            'date': None,
            'invoice_number': None,
            'vendor_name': None
        }
        
        # Simple parsing logic (would need to be enhanced for real use)
        for i, line in enumerate(lines):
            if i == 0:
                # First line is often the vendor name
                data['vendor_name'] = line
            elif 'total' in line.lower() and any(c.isdigit() for c in line):
                # Extract total amount
                import re
                numbers = re.findall(r'\d+\.\d+|\d+', line)
                if numbers:
                    data['total'] = numbers[-1]
            elif any(date_format in line.lower() for date_format in ['date:', 'dt:', 'date']):
                # Extract date
                data['date'] = line
            elif any(inv in line.lower() for inv in ['invoice', 'bill no', 'receipt no']):
                # Extract invoice number
                data['invoice_number'] = line
            elif any(c.isdigit() for c in line) and len(line.split()) >= 2:
                # This might be an item with price
                data['items'].append(line)
        
        return data
    
    except Exception as e:
        return {'error': str(e)}


# Helper function for translation
def translate_text(text, target_language='en'):
    """Translate text to target language using Google Translate API"""
    try:
        # Initialize translation client
        translate_client = translate.Client()
        
        # Perform translation
        result = translate_client.translate(text, target_language=target_language)
        
        return result['translatedText']
    
    except Exception as e:
        return {'error': str(e)}


@ocr_bp.route('/scan', methods=['POST'])
@jwt_required()
def scan_image():
    """Scan an image for text extraction"""
    # Check if file is present in request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    # Check if file is empty
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Get OCR method from request
    ocr_method = request.form.get('method', 'tesseract')  # 'tesseract' or 'google'
    
    # Get scan type from request
    scan_type = request.form.get('scan_type', 'bill')
    
    # Get language from request
    source_language = request.form.get('language')
    translate_to_english = request.form.get('translate', 'false').lower() == 'true'
    
    # Save file
    filename, file_path = save_file(file)
    
    # Create OCR scan record
    ocr_scan = OCRScan(
        filename=filename,
        scan_type=scan_type,
        original_language=source_language
    )
    db.session.add(ocr_scan)
    db.session.flush()
    
    # Process image with selected OCR method
    if ocr_method == 'google':
        result = process_with_google_vision(file_path)
    else:
        result = process_with_tesseract(file_path)
    
    # Translate if requested and source language is not English
    if translate_to_english and source_language and source_language != 'en':
        if 'raw_text' in result:
            translated_text = translate_text(result['raw_text'])
            if not isinstance(translated_text, dict) or 'error' not in translated_text:
                result['translated_text'] = translated_text
                ocr_scan.translated = True
    
    # Update OCR scan record
    ocr_scan.processed = True
    ocr_scan.result_json = json.dumps(result)
    db.session.commit()
    
    # Add scan ID to result
    result['scan_id'] = ocr_scan.id
    
    return jsonify(result), 200


@ocr_bp.route('/scans', methods=['GET'])
@jwt_required()
def get_scans():
    """Get all OCR scans"""
    scans = OCRScan.query.order_by(OCRScan.scan_date.desc()).all()
    scans_list = []
    
    for scan in scans:
        scans_list.append({
            'id': scan.id,
            'filename': scan.filename,
            'scan_date': scan.scan_date.isoformat(),
            'scan_type': scan.scan_type,
            'processed': scan.processed,
            'original_language': scan.original_language,
            'translated': scan.translated
        })
    
    return jsonify(scans_list), 200


@ocr_bp.route('/scans/<int:scan_id>', methods=['GET'])
@jwt_required()
def get_scan(scan_id):
    """Get a specific OCR scan with results"""
    scan = OCRScan.query.get(scan_id)
    
    if not scan:
        return jsonify({'error': 'Scan not found'}), 404
    
    # Parse result JSON
    result = json.loads(scan.result_json) if scan.result_json else {}
    
    return jsonify({
        'id': scan.id,
        'filename': scan.filename,
        'scan_date': scan.scan_date.isoformat(),
        'scan_type': scan.scan_type,
        'processed': scan.processed,
        'original_language': scan.original_language,
        'translated': scan.translated,
        'result': result
    }), 200