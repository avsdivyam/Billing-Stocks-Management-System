from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    """Application factory function"""
    app = Flask(__name__)
    
    # Configure the app
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
        'DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/billing_stocks'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-key-change-in-production')
    
    # Initialize extensions with app
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    from app.api.auth import auth_bp
    from app.api.users import users_bp
    from app.api.vendors import vendors_bp
    from app.api.inventory import inventory_bp
    from app.api.billing import billing_bp
    from app.api.reports import reports_bp
    from app.api.ocr import ocr_bp
    from app.api.speech import speech_bp
    from app.api.backup import backup_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(vendors_bp, url_prefix='/api/vendors')
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    app.register_blueprint(billing_bp, url_prefix='/api/billing')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(ocr_bp, url_prefix='/api/ocr')
    app.register_blueprint(speech_bp, url_prefix='/api/speech')
    app.register_blueprint(backup_bp, url_prefix='/api/backup')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app