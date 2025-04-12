from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

from app.api.auth import routes