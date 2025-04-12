from app import db
from datetime import datetime

class Backup(db.Model):
    """Backup model for tracking database backups"""
    __tablename__ = 'backups'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    backup_date = db.Column(db.DateTime, default=datetime.utcnow)
    size_bytes = db.Column(db.Integer, nullable=True)
    backup_type = db.Column(db.String(20), default='manual')  # 'manual', 'scheduled'
    storage_location = db.Column(db.String(255), nullable=True)  # 'local', 'cloud'
    status = db.Column(db.String(20), default='completed')  # 'completed', 'failed'
    
    def __repr__(self):
        return f'<Backup {self.filename}>'