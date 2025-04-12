from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt
from app.models import Backup
from app import db
import os
import subprocess
import datetime
import uuid
import shutil

backup_bp = Blueprint('backup', __name__)

# Configure backup folder
BACKUP_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'backups')
if not os.path.exists(BACKUP_FOLDER):
    os.makedirs(BACKUP_FOLDER)

# Helper function to check if user is admin
def is_admin():
    jwt_data = get_jwt()
    return jwt_data.get('role') == 'admin'


@backup_bp.route('/', methods=['POST'])
@jwt_required()
def create_backup():
    """Create a database backup"""
    # Only admins can create backups
    if not is_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    # Get backup type from request
    backup_type = request.json.get('type', 'manual')
    
    # Generate backup filename
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"backup_{timestamp}_{uuid.uuid4().hex[:8]}.sql"
    file_path = os.path.join(BACKUP_FOLDER, filename)
    
    try:
        # Get database URL from app config
        from flask import current_app
        db_url = current_app.config['SQLALCHEMY_DATABASE_URI']
        
        # Parse database URL to get connection details
        # Example: postgresql://username:password@localhost:5432/dbname
        db_parts = db_url.replace('postgresql://', '').split('/')
        db_name = db_parts[1]
        conn_parts = db_parts[0].split('@')
        
        if len(conn_parts) > 1:
            auth_parts = conn_parts[0].split(':')
            host_parts = conn_parts[1].split(':')
            
            username = auth_parts[0]
            password = auth_parts[1] if len(auth_parts) > 1 else ''
            host = host_parts[0]
            port = host_parts[1] if len(host_parts) > 1 else '5432'
        else:
            # Default values if URL doesn't contain auth info
            username = 'postgres'
            password = 'postgres'
            host_parts = conn_parts[0].split(':')
            host = host_parts[0]
            port = host_parts[1] if len(host_parts) > 1 else '5432'
        
        # Set PGPASSWORD environment variable for password
        env = os.environ.copy()
        if password:
            env['PGPASSWORD'] = password
        
        # Execute pg_dump command
        command = [
            'pg_dump',
            '-h', host,
            '-p', port,
            '-U', username,
            '-F', 'p',  # plain text format
            '-f', file_path,
            db_name
        ]
        
        process = subprocess.run(
            command,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if process.returncode != 0:
            raise Exception(f"pg_dump failed: {process.stderr}")
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Create backup record
        new_backup = Backup(
            filename=filename,
            size_bytes=file_size,
            backup_type=backup_type,
            storage_location='local',
            status='completed'
        )
        
        db.session.add(new_backup)
        db.session.commit()
        
        return jsonify({
            'message': 'Backup created successfully',
            'backup': {
                'id': new_backup.id,
                'filename': new_backup.filename,
                'backup_date': new_backup.backup_date.isoformat(),
                'size_bytes': new_backup.size_bytes,
                'backup_type': new_backup.backup_type
            }
        }), 201
    
    except Exception as e:
        # Create failed backup record
        failed_backup = Backup(
            filename=filename,
            backup_type=backup_type,
            storage_location='local',
            status='failed'
        )
        
        db.session.add(failed_backup)
        db.session.commit()
        
        return jsonify({
            'error': f'Backup failed: {str(e)}'
        }), 500


@backup_bp.route('/', methods=['GET'])
@jwt_required()
def get_backups():
    """Get all backups"""
    # Only admins can view backups
    if not is_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    backups = Backup.query.order_by(Backup.backup_date.desc()).all()
    backups_list = []
    
    for backup in backups:
        backups_list.append({
            'id': backup.id,
            'filename': backup.filename,
            'backup_date': backup.backup_date.isoformat(),
            'size_bytes': backup.size_bytes,
            'backup_type': backup.backup_type,
            'storage_location': backup.storage_location,
            'status': backup.status
        })
    
    return jsonify(backups_list), 200


@backup_bp.route('/<int:backup_id>', methods=['GET'])
@jwt_required()
def download_backup(backup_id):
    """Download a specific backup"""
    # Only admins can download backups
    if not is_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    backup = Backup.query.get(backup_id)
    
    if not backup:
        return jsonify({'error': 'Backup not found'}), 404
    
    if backup.status != 'completed':
        return jsonify({'error': 'Backup is not available for download'}), 400
    
    file_path = os.path.join(BACKUP_FOLDER, backup.filename)
    
    if not os.path.exists(file_path):
        return jsonify({'error': 'Backup file not found on server'}), 404
    
    return send_file(
        file_path,
        as_attachment=True,
        download_name=backup.filename,
        mimetype='application/sql'
    )


@backup_bp.route('/<int:backup_id>', methods=['DELETE'])
@jwt_required()
def delete_backup(backup_id):
    """Delete a specific backup"""
    # Only admins can delete backups
    if not is_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    backup = Backup.query.get(backup_id)
    
    if not backup:
        return jsonify({'error': 'Backup not found'}), 404
    
    file_path = os.path.join(BACKUP_FOLDER, backup.filename)
    
    # Delete file if it exists
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Delete record from database
    db.session.delete(backup)
    db.session.commit()
    
    return jsonify({'message': 'Backup deleted successfully'}), 200


@backup_bp.route('/restore', methods=['POST'])
@jwt_required()
def restore_backup():
    """Restore database from backup"""
    # Only admins can restore backups
    if not is_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    
    # Check if backup ID is provided
    if not data or 'backup_id' not in data:
        return jsonify({'error': 'Backup ID is required'}), 400
    
    backup = Backup.query.get(data['backup_id'])
    
    if not backup:
        return jsonify({'error': 'Backup not found'}), 404
    
    if backup.status != 'completed':
        return jsonify({'error': 'Cannot restore from an incomplete backup'}), 400
    
    file_path = os.path.join(BACKUP_FOLDER, backup.filename)
    
    if not os.path.exists(file_path):
        return jsonify({'error': 'Backup file not found on server'}), 404
    
    try:
        # Get database URL from app config
        from flask import current_app
        db_url = current_app.config['SQLALCHEMY_DATABASE_URI']
        
        # Parse database URL to get connection details
        db_parts = db_url.replace('postgresql://', '').split('/')
        db_name = db_parts[1]
        conn_parts = db_parts[0].split('@')
        
        if len(conn_parts) > 1:
            auth_parts = conn_parts[0].split(':')
            host_parts = conn_parts[1].split(':')
            
            username = auth_parts[0]
            password = auth_parts[1] if len(auth_parts) > 1 else ''
            host = host_parts[0]
            port = host_parts[1] if len(host_parts) > 1 else '5432'
        else:
            # Default values if URL doesn't contain auth info
            username = 'postgres'
            password = 'postgres'
            host_parts = conn_parts[0].split(':')
            host = host_parts[0]
            port = host_parts[1] if len(host_parts) > 1 else '5432'
        
        # Set PGPASSWORD environment variable for password
        env = os.environ.copy()
        if password:
            env['PGPASSWORD'] = password
        
        # First, create a backup of current state before restoring
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        pre_restore_filename = f"pre_restore_{timestamp}_{uuid.uuid4().hex[:8]}.sql"
        pre_restore_path = os.path.join(BACKUP_FOLDER, pre_restore_filename)
        
        # Execute pg_dump to create pre-restore backup
        pre_restore_command = [
            'pg_dump',
            '-h', host,
            '-p', port,
            '-U', username,
            '-F', 'p',  # plain text format
            '-f', pre_restore_path,
            db_name
        ]
        
        pre_restore_process = subprocess.run(
            pre_restore_command,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if pre_restore_process.returncode != 0:
            raise Exception(f"Pre-restore backup failed: {pre_restore_process.stderr}")
        
        # Create pre-restore backup record
        pre_restore_size = os.path.getsize(pre_restore_path)
        pre_restore_backup = Backup(
            filename=pre_restore_filename,
            size_bytes=pre_restore_size,
            backup_type='pre_restore',
            storage_location='local',
            status='completed'
        )
        
        db.session.add(pre_restore_backup)
        db.session.commit()
        
        # Now restore from the selected backup
        # First, drop all connections to the database
        drop_conn_command = [
            'psql',
            '-h', host,
            '-p', port,
            '-U', username,
            '-d', 'postgres',  # Connect to postgres database to run command
            '-c', f"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '{db_name}' AND pid <> pg_backend_pid();"
        ]
        
        drop_conn_process = subprocess.run(
            drop_conn_command,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if drop_conn_process.returncode != 0:
            raise Exception(f"Failed to drop connections: {drop_conn_process.stderr}")
        
        # Drop and recreate the database
        drop_db_command = [
            'psql',
            '-h', host,
            '-p', port,
            '-U', username,
            '-d', 'postgres',  # Connect to postgres database to run command
            '-c', f"DROP DATABASE IF EXISTS {db_name}; CREATE DATABASE {db_name};"
        ]
        
        drop_db_process = subprocess.run(
            drop_db_command,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if drop_db_process.returncode != 0:
            raise Exception(f"Failed to recreate database: {drop_db_process.stderr}")
        
        # Restore from backup
        restore_command = [
            'psql',
            '-h', host,
            '-p', port,
            '-U', username,
            '-d', db_name,
            '-f', file_path
        ]
        
        restore_process = subprocess.run(
            restore_command,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if restore_process.returncode != 0:
            raise Exception(f"Restore failed: {restore_process.stderr}")
        
        return jsonify({
            'message': 'Database restored successfully',
            'pre_restore_backup_id': pre_restore_backup.id
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': f'Restore failed: {str(e)}'
        }), 500