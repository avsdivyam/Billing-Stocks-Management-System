from app import db
from datetime import datetime

class OCRScan(db.Model):
    """OCR scan model for tracking scanned documents"""
    __tablename__ = 'ocr_scans'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    scan_date = db.Column(db.DateTime, default=datetime.utcnow)
    scan_type = db.Column(db.String(20), default='bill')  # 'bill', 'invoice', 'receipt'
    processed = db.Column(db.Boolean, default=False)
    result_json = db.Column(db.Text, nullable=True)  # JSON string of extracted data
    original_language = db.Column(db.String(20), nullable=True)
    translated = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<OCRScan {self.filename}>'