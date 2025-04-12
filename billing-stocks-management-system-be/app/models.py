# This file is kept for backward compatibility
# All models have been moved to the models/ directory

# Import all models from the new structure
from app.models.user import User
from app.models.vendor import Vendor
from app.models.category import Category
from app.models.product import Product
from app.models.purchase import Purchase, PurchaseItem
from app.models.customer import Customer
from app.models.sale import Sale, SaleItem
from app.models.backup import Backup
from app.models.ocr_scan import OCRScan

# This allows importing all models from app.models directly
__all__ = [
    'User',
    'Vendor',
    'Category',
    'Product',
    'Purchase',
    'PurchaseItem',
    'Customer',
    'Sale',
    'SaleItem',
    'Backup',
    'OCRScan'
]