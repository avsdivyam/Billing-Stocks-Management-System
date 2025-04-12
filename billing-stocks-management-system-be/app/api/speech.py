from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import os
import uuid
import speech_recognition as sr
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import translate_v2 as translate

speech_bp = Blueprint('speech', __name__)

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'uploads', 'audio')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Helper function to save uploaded file
def save_file(file):
    """Save uploaded audio file and return filename"""
    filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    return filename, file_path


# Helper function for speech recognition using SpeechRecognition library
def recognize_with_sr(file_path, language='en-US'):
    """Process audio with SpeechRecognition library"""
    try:
        # Initialize recognizer
        recognizer = sr.Recognizer()
        
        # Load audio file
        with sr.AudioFile(file_path) as source:
            # Adjust for ambient noise
            recognizer.adjust_for_ambient_noise(source)
            # Record audio
            audio = recognizer.record(source)
        
        # Recognize speech using Google Speech Recognition
        text = recognizer.recognize_google(audio, language=language)
        
        return {'text': text}
    
    except sr.UnknownValueError:
        return {'error': 'Speech could not be recognized'}
    except sr.RequestError as e:
        return {'error': f'Could not request results: {str(e)}'}
    except Exception as e:
        return {'error': str(e)}


# Helper function for speech recognition using Google Cloud Speech API
def recognize_with_google_cloud(file_path, language='en-US'):
    """Process audio with Google Cloud Speech API"""
    try:
        # Initialize client
        client = speech.SpeechClient()
        
        # Read audio file
        with open(file_path, 'rb') as audio_file:
            content = audio_file.read()
        
        # Configure audio
        audio = speech.RecognitionAudio(content=content)
        
        # Configure recognition
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code=language,
            enable_automatic_punctuation=True
        )
        
        # Perform recognition
        response = client.recognize(config=config, audio=audio)
        
        # Extract results
        results = []
        for result in response.results:
            results.append(result.alternatives[0].transcript)
        
        text = ' '.join(results)
        
        return {'text': text}
    
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
        
        return {'translated_text': result['translatedText']}
    
    except Exception as e:
        return {'error': str(e)}


@speech_bp.route('/recognize', methods=['POST'])
@jwt_required()
def recognize_speech():
    """Recognize speech from audio file"""
    # Check if file is present in request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    # Check if file is empty
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Get recognition method from request
    method = request.form.get('method', 'sr')  # 'sr' or 'google'
    
    # Get language from request
    language = request.form.get('language', 'en-US')
    
    # Get translation flag from request
    translate_to_english = request.form.get('translate', 'false').lower() == 'true'
    
    # Save file
    filename, file_path = save_file(file)
    
    # Process audio with selected method
    if method == 'google':
        result = recognize_with_google_cloud(file_path, language)
    else:
        result = recognize_with_sr(file_path, language)
    
    # Translate if requested and source language is not English
    if translate_to_english and language and not language.startswith('en') and 'text' in result:
        translation = translate_text(result['text'])
        if 'translated_text' in translation:
            result['translated_text'] = translation['translated_text']
    
    return jsonify(result), 200


@speech_bp.route('/languages', methods=['GET'])
def get_languages():
    """Get supported languages for speech recognition"""
    # List of commonly supported languages by Google Speech Recognition
    languages = [
        {'code': 'en-US', 'name': 'English (US)'},
        {'code': 'en-GB', 'name': 'English (UK)'},
        {'code': 'en-IN', 'name': 'English (India)'},
        {'code': 'hi-IN', 'name': 'Hindi'},
        {'code': 'bn-IN', 'name': 'Bengali'},
        {'code': 'ta-IN', 'name': 'Tamil'},
        {'code': 'te-IN', 'name': 'Telugu'},
        {'code': 'mr-IN', 'name': 'Marathi'},
        {'code': 'gu-IN', 'name': 'Gujarati'},
        {'code': 'kn-IN', 'name': 'Kannada'},
        {'code': 'ml-IN', 'name': 'Malayalam'},
        {'code': 'pa-IN', 'name': 'Punjabi'},
        {'code': 'ur-IN', 'name': 'Urdu'},
        {'code': 'es-ES', 'name': 'Spanish'},
        {'code': 'fr-FR', 'name': 'French'},
        {'code': 'de-DE', 'name': 'German'},
        {'code': 'it-IT', 'name': 'Italian'},
        {'code': 'ja-JP', 'name': 'Japanese'},
        {'code': 'ko-KR', 'name': 'Korean'},
        {'code': 'zh-CN', 'name': 'Chinese (Simplified)'},
        {'code': 'ru-RU', 'name': 'Russian'},
        {'code': 'pt-BR', 'name': 'Portuguese (Brazil)'},
        {'code': 'ar-AE', 'name': 'Arabic'}
    ]
    
    return jsonify(languages), 200