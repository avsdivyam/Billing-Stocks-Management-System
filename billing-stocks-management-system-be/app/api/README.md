# API Directory Structure

This directory contains all the API routes and controllers for the Billing & Stocks Management System.

## Organization

The API is organized into feature-based modules, each with its own directory:

- `auth/` - Authentication routes (login, register, profile)
- `users/` - User management routes
- `vendors/` - Vendor management routes
- `inventory/` - Product and category management routes
- `billing/` - Sales, purchases, and customer management routes
- `reports/` - Reporting and analytics routes
- `ocr/` - OCR scanning and processing routes
- `speech/` - Speech recognition routes
- `backup/` - Database backup and restore routes

Each module directory contains:
- `__init__.py` - Blueprint initialization
- `routes.py` - Route handlers and business logic

## Blueprint Structure

Each feature module defines its own Blueprint that is registered in the main application factory.

Example:

```python
# In app/api/auth/__init__.py
from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

from app.api.auth import routes
```

## URL Prefixes

All API routes are prefixed with `/api` followed by the module name:

- Authentication: `/api/auth/*`
- Users: `/api/users/*`
- Vendors: `/api/vendors/*`
- Inventory: `/api/inventory/*`
- Billing: `/api/billing/*`
- Reports: `/api/reports/*`
- OCR: `/api/ocr/*`
- Speech: `/api/speech/*`
- Backup: `/api/backup/*`