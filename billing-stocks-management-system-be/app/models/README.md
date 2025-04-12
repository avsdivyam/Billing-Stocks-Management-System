# Models Directory Structure

This directory contains all the database models for the Billing & Stocks Management System.

## Organization

Each model is separated into its own file for better organization and maintainability:

- `user.py` - User model for authentication and user management
- `vendor.py` - Vendor model for suppliers
- `category.py` - Category model for product categorization
- `product.py` - Product model for inventory items
- `purchase.py` - Purchase and PurchaseItem models for stock purchases
- `customer.py` - Customer model for client information
- `sale.py` - Sale and SaleItem models for billing
- `backup.py` - Backup model for tracking database backups
- `ocr_scan.py` - OCRScan model for tracking scanned documents

## Usage

All models can be imported directly from the `app.models` package:

```python
from app.models import User, Product, Sale
```

## Relationships

The models have the following relationships:

- User: No direct relationships to other models
- Vendor: Has many Products and Purchases
- Category: Has many Products
- Product: Belongs to Category and Vendor, has many PurchaseItems and SaleItems
- Purchase: Belongs to Vendor, has many PurchaseItems
- PurchaseItem: Belongs to Purchase and Product
- Customer: Has many Sales
- Sale: Belongs to Customer, has many SaleItems
- SaleItem: Belongs to Sale and Product
- Backup: No direct relationships to other models
- OCRScan: No direct relationships to other models