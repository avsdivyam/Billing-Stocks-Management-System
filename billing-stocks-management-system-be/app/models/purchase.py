from app import db
from datetime import datetime

class Purchase(db.Model):
    """Purchase model for stock purchases"""
    __tablename__ = 'purchases'
    
    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(50), nullable=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    purchase_date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    total_amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(20), default='pending')  # 'pending', 'partial', 'paid'
    payment_method = db.Column(db.String(20), nullable=True)  # 'cash', 'credit', 'upi', 'bank_transfer'
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('PurchaseItem', backref='purchase', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Purchase {self.invoice_number}>'


class PurchaseItem(db.Model):
    """Purchase item model for items in a purchase"""
    __tablename__ = 'purchase_items'
    
    id = db.Column(db.Integer, primary_key=True)
    purchase_id = db.Column(db.Integer, db.ForeignKey('purchases.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    gst_amount = db.Column(db.Float, default=0)
    total_price = db.Column(db.Float, nullable=False)
    
    def __repr__(self):
        return f'<PurchaseItem {self.id}>'