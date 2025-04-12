from app import db
from datetime import datetime

class Sale(db.Model):
    """Sale model for billing"""
    __tablename__ = 'sales'
    
    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(50), nullable=False, unique=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    sale_date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    subtotal = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float, default=0)
    gst_amount = db.Column(db.Float, default=0)
    total_amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(20), default='paid')  # 'pending', 'partial', 'paid'
    payment_method = db.Column(db.String(20), default='cash')  # 'cash', 'credit', 'upi', 'card'
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('SaleItem', backref='sale', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Sale {self.invoice_number}>'


class SaleItem(db.Model):
    """Sale item model for items in a sale"""
    __tablename__ = 'sale_items'
    
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    gst_percentage = db.Column(db.Float, default=0)
    gst_amount = db.Column(db.Float, default=0)
    discount = db.Column(db.Float, default=0)
    total_price = db.Column(db.Float, nullable=False)
    
    def __repr__(self):
        return f'<SaleItem {self.id}>'