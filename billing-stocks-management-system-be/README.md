# Billing & Stocks Management System - Backend

This is the backend API for the Billing & Stocks Management System, built with Flask and PostgreSQL.

## Features

- User authentication and authorization
- Vendor and customer management
- Product and inventory management
- Sales and purchase tracking
- GST-compliant billing
- OCR for scanning bills and receipts
- Speech-to-text for voice input
- Reporting (sales, purchases, GST, inventory)
- Database backup and restore

## Project Structure

The project follows a modular structure for better organization and maintainability:

```
billing-stocks-management-system-be/
├── app/                        # Main application package
│   ├── api/                    # API routes and controllers
│   │   ├── auth/               # Authentication module
│   │   ├── users/              # User management module
│   │   ├── vendors/            # Vendor management module
│   │   ├── inventory/          # Inventory management module
│   │   ├── billing/            # Billing module
│   │   ├── reports/            # Reporting module
│   │   ├── ocr/                # OCR module
│   │   ├── speech/             # Speech recognition module
│   │   └── backup/             # Backup module
│   ├── models/                 # Database models
│   │   ├── user.py             # User model
│   │   ├── vendor.py           # Vendor model
│   │   ├── category.py         # Category model
│   │   ├── product.py          # Product model
│   │   ├── purchase.py         # Purchase models
│   │   ├── customer.py         # Customer model
│   │   ├── sale.py             # Sale models
│   │   ├── backup.py           # Backup model
│   │   └── ocr_scan.py         # OCR scan model
│   └── __init__.py             # Application factory
├── backups/                    # Database backup files
├── reports/                    # Generated report files
├── uploads/                    # Uploaded files (images, audio)
├── .env                        # Environment variables
├── requirements.txt            # Python dependencies
└── run.py                      # Application entry point
```

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

## Installation

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Create a PostgreSQL database:
   ```
   createdb billing_stocks
   ```
6. Configure environment variables in `.env` file
7. Initialize the database:
   ```
   flask db init
   flask db migrate
   flask db upgrade
   ```

## Running the Application

```
flask run
```

Or:

```
python run.py
```

The API will be available at http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get access token
- GET /api/auth/profile - Get current user profile
- PUT /api/auth/change-password - Change user password

### Users
- GET /api/users - Get all users (admin only)
- GET /api/users/:id - Get a specific user
- PUT /api/users/:id - Update a user
- DELETE /api/users/:id - Delete a user (admin only)

### Vendors
- GET /api/vendors - Get all vendors
- GET /api/vendors/:id - Get a specific vendor
- POST /api/vendors - Create a new vendor
- PUT /api/vendors/:id - Update a vendor
- DELETE /api/vendors/:id - Delete a vendor

### Inventory
- GET /api/inventory/categories - Get all categories
- POST /api/inventory/categories - Create a new category
- PUT /api/inventory/categories/:id - Update a category
- DELETE /api/inventory/categories/:id - Delete a category
- GET /api/inventory/products - Get all products
- GET /api/inventory/products/:id - Get a specific product
- POST /api/inventory/products - Create a new product
- PUT /api/inventory/products/:id - Update a product
- DELETE /api/inventory/products/:id - Delete a product
- GET /api/inventory/products/low-stock - Get products with stock below threshold

### Billing
- GET /api/billing/customers - Get all customers
- GET /api/billing/customers/:id - Get a specific customer
- POST /api/billing/customers - Create a new customer
- PUT /api/billing/customers/:id - Update a customer
- GET /api/billing/sales - Get all sales
- GET /api/billing/sales/:id - Get a specific sale with its items
- POST /api/billing/sales - Create a new sale (bill)
- GET /api/billing/purchases - Get all purchases
- GET /api/billing/purchases/:id - Get a specific purchase with its items
- POST /api/billing/purchases - Create a new purchase

### OCR
- POST /api/ocr/scan - Scan an image for text extraction
- GET /api/ocr/scans - Get all OCR scans
- GET /api/ocr/scans/:id - Get a specific OCR scan with results

### Speech
- POST /api/speech/recognize - Recognize speech from audio file
- GET /api/speech/languages - Get supported languages for speech recognition

### Reports
- GET /api/reports/sales - Generate sales report
- GET /api/reports/purchases - Generate purchases report
- GET /api/reports/gst - Generate GST report
- GET /api/reports/inventory - Generate inventory report

### Backup
- POST /api/backup - Create a database backup
- GET /api/backup - Get all backups
- GET /api/backup/:id - Download a specific backup
- DELETE /api/backup/:id - Delete a specific backup
- POST /api/backup/restore - Restore database from backup

## Development

### Adding a New Model

1. Create a new file in the `app/models/` directory
2. Define your model class
3. Add the model to `app/models/__init__.py`

### Adding a New API Endpoint

1. Create a new directory in `app/api/` if it's a new feature
2. Create `__init__.py` with a Blueprint
3. Create `routes.py` with your route handlers
4. Register the Blueprint in `app/__init__.py`

## License

This project is licensed under the MIT License.


## A Google Cloud project with the Vision API enabled.

Downloaded the service account JSON key file.

Set the GOOGLE_APPLICATION_CREDENTIALS environment variable:

Windows (PowerShell):

powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\service-account.json"