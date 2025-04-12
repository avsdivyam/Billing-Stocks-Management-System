from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import Sale, SaleItem, Customer, Product, Purchase, PurchaseItem, Vendor
from app import db
from datetime import datetime
import random
import string

billing_bp = Blueprint('billing', __name__)

# Helper function to generate invoice number
def generate_invoice_number(prefix='INV'):
    """Generate a unique invoice number"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"{prefix}-{timestamp}-{random_str}"


# Customer routes
@billing_bp.route('/customers', methods=['GET'])
@jwt_required()
def get_customers():
    """Get all customers"""
    customers = Customer.query.all()
    customers_list = []
    
    for customer in customers:
        customers_list.append({
            'id': customer.id,
            'name': customer.name,
            'phone': customer.phone,
            'email': customer.email,
            'address': customer.address,
            'gst_number': customer.gst_number,
            'created_at': customer.created_at.isoformat()
        })
    
    return jsonify(customers_list), 200


@billing_bp.route('/customers/<int:customer_id>', methods=['GET'])
@jwt_required()
def get_customer(customer_id):
    """Get a specific customer"""
    customer = Customer.query.get(customer_id)
    
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    
    return jsonify({
        'id': customer.id,
        'name': customer.name,
        'phone': customer.phone,
        'email': customer.email,
        'address': customer.address,
        'gst_number': customer.gst_number,
        'created_at': customer.created_at.isoformat()
    }), 200


@billing_bp.route('/customers', methods=['POST'])
@jwt_required()
def create_customer():
    """Create a new customer"""
    data = request.get_json()
    
    # Check if required fields are present
    if not data or 'name' not in data:
        return jsonify({'error': 'Customer name is required'}), 400
    
    # Create new customer
    new_customer = Customer(
        name=data['name'],
        phone=data.get('phone'),
        email=data.get('email'),
        address=data.get('address'),
        gst_number=data.get('gst_number')
    )
    
    # Save to database
    db.session.add(new_customer)
    db.session.commit()
    
    return jsonify({
        'message': 'Customer created successfully',
        'customer': {
            'id': new_customer.id,
            'name': new_customer.name,
            'phone': new_customer.phone,
            'email': new_customer.email,
            'gst_number': new_customer.gst_number
        }
    }), 201


@billing_bp.route('/customers/<int:customer_id>', methods=['PUT'])
@jwt_required()
def update_customer(customer_id):
    """Update a customer"""
    customer = Customer.query.get(customer_id)
    
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    
    data = request.get_json()
    
    # Update customer fields
    if 'name' in data:
        customer.name = data['name']
    if 'phone' in data:
        customer.phone = data['phone']
    if 'email' in data:
        customer.email = data['email']
    if 'address' in data:
        customer.address = data['address']
    if 'gst_number' in data:
        customer.gst_number = data['gst_number']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Customer updated successfully',
        'customer': {
            'id': customer.id,
            'name': customer.name,
            'phone': customer.phone,
            'email': customer.email,
            'gst_number': customer.gst_number
        }
    }), 200


# Sales routes
@billing_bp.route('/sales', methods=['GET'])
@jwt_required()
def get_sales():
    """Get all sales with optional filtering"""
    # Get query parameters for filtering
    customer_id = request.args.get('customer_id', type=int)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Start with base query
    query = Sale.query
    
    # Apply filters if provided
    if customer_id:
        query = query.filter_by(customer_id=customer_id)
    if start_date:
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            query = query.filter(Sale.sale_date >= start_date)
        except ValueError:
            return jsonify({'error': 'Invalid start_date format. Use YYYY-MM-DD'}), 400
    if end_date:
        try:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(Sale.sale_date <= end_date)
        except ValueError:
            return jsonify({'error': 'Invalid end_date format. Use YYYY-MM-DD'}), 400
    
    # Execute query
    sales = query.all()
    sales_list = []
    
    for sale in sales:
        sales_list.append({
            'id': sale.id,
            'invoice_number': sale.invoice_number,
            'customer_id': sale.customer_id,
            'customer_name': sale.customer.name if sale.customer else 'Walk-in Customer',
            'sale_date': sale.sale_date.isoformat(),
            'subtotal': sale.subtotal,
            'discount': sale.discount,
            'gst_amount': sale.gst_amount,
            'total_amount': sale.total_amount,
            'payment_status': sale.payment_status,
            'payment_method': sale.payment_method,
            'created_at': sale.created_at.isoformat()
        })
    
    return jsonify(sales_list), 200


@billing_bp.route('/sales/<int:sale_id>', methods=['GET'])
@jwt_required()
def get_sale(sale_id):
    """Get a specific sale with its items"""
    sale = Sale.query.get(sale_id)
    
    if not sale:
        return jsonify({'error': 'Sale not found'}), 404
    
    # Get sale items
    items = []
    for item in sale.items:
        items.append({
            'id': item.id,
            'product_id': item.product_id,
            'product_name': item.product.name,
            'quantity': item.quantity,
            'unit_price': item.unit_price,
            'gst_percentage': item.gst_percentage,
            'gst_amount': item.gst_amount,
            'discount': item.discount,
            'total_price': item.total_price
        })
    
    return jsonify({
        'id': sale.id,
        'invoice_number': sale.invoice_number,
        'customer_id': sale.customer_id,
        'customer_name': sale.customer.name if sale.customer else 'Walk-in Customer',
        'customer_phone': sale.customer.phone if sale.customer else None,
        'customer_gst': sale.customer.gst_number if sale.customer else None,
        'sale_date': sale.sale_date.isoformat(),
        'subtotal': sale.subtotal,
        'discount': sale.discount,
        'gst_amount': sale.gst_amount,
        'total_amount': sale.total_amount,
        'payment_status': sale.payment_status,
        'payment_method': sale.payment_method,
        'notes': sale.notes,
        'items': items,
        'created_at': sale.created_at.isoformat()
    }), 200


@billing_bp.route('/sales', methods=['POST'])
@jwt_required()
def create_sale():
    """Create a new sale (bill)"""
    data = request.get_json()
    
    # Check if required fields are present
    if not data or 'items' not in data or not data['items']:
        return jsonify({'error': 'Sale items are required'}), 400
    
    # Validate customer if provided
    customer_id = data.get('customer_id')
    if customer_id and not Customer.query.get(customer_id):
        return jsonify({'error': 'Customer not found'}), 400
    
    # Generate invoice number
    invoice_number = data.get('invoice_number') or generate_invoice_number()
    
    # Check if invoice number already exists
    if Sale.query.filter_by(invoice_number=invoice_number).first():
        return jsonify({'error': 'Invoice number already exists'}), 400
    
    # Create new sale
    new_sale = Sale(
        invoice_number=invoice_number,
        customer_id=customer_id,
        sale_date=datetime.strptime(data.get('sale_date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
        subtotal=0,  # Will be calculated
        discount=data.get('discount', 0),
        gst_amount=0,  # Will be calculated
        total_amount=0,  # Will be calculated
        payment_status=data.get('payment_status', 'paid'),
        payment_method=data.get('payment_method', 'cash'),
        notes=data.get('notes')
    )
    
    # Add sale to database to get ID
    db.session.add(new_sale)
    db.session.flush()
    
    # Process sale items
    subtotal = 0
    total_gst = 0
    
    for item_data in data['items']:
        # Validate product
        product_id = item_data.get('product_id')
        if not product_id:
            db.session.rollback()
            return jsonify({'error': 'Product ID is required for each item'}), 400
        
        product = Product.query.get(product_id)
        if not product:
            db.session.rollback()
            return jsonify({'error': f'Product with ID {product_id} not found'}), 400
        
        # Get quantity
        quantity = item_data.get('quantity', 1)
        if quantity <= 0:
            db.session.rollback()
            return jsonify({'error': 'Quantity must be greater than zero'}), 400
        
        # Check if enough stock is available
        if product.stock_quantity < quantity:
            db.session.rollback()
            return jsonify({
                'error': f'Insufficient stock for product {product.name}. Available: {product.stock_quantity}'
            }), 400
        
        # Get unit price (use selling_price if not provided)
        unit_price = item_data.get('unit_price', product.selling_price)
        
        # Calculate item discount
        item_discount = item_data.get('discount', 0)
        
        # Calculate GST
        gst_percentage = item_data.get('gst_percentage', product.gst_percentage)
        price_after_discount = (unit_price - item_discount) * quantity
        gst_amount = (price_after_discount * gst_percentage) / 100
        
        # Calculate total price
        total_price = price_after_discount + gst_amount
        
        # Create sale item
        sale_item = SaleItem(
            sale_id=new_sale.id,
            product_id=product_id,
            quantity=quantity,
            unit_price=unit_price,
            gst_percentage=gst_percentage,
            gst_amount=gst_amount,
            discount=item_discount,
            total_price=total_price
        )
        
        # Add sale item to database
        db.session.add(sale_item)
        
        # Update product stock
        product.stock_quantity -= quantity
        
        # Update totals
        subtotal += price_after_discount
        total_gst += gst_amount
    
    # Calculate total amount
    total_discount = data.get('discount', 0)
    total_amount = subtotal + total_gst - total_discount
    
    # Update sale with calculated values
    new_sale.subtotal = subtotal
    new_sale.gst_amount = total_gst
    new_sale.total_amount = total_amount
    
    # Commit transaction
    db.session.commit()
    
    return jsonify({
        'message': 'Sale created successfully',
        'sale': {
            'id': new_sale.id,
            'invoice_number': new_sale.invoice_number,
            'total_amount': new_sale.total_amount
        }
    }), 201


# Purchase routes
@billing_bp.route('/purchases', methods=['GET'])
@jwt_required()
def get_purchases():
    """Get all purchases with optional filtering"""
    # Get query parameters for filtering
    vendor_id = request.args.get('vendor_id', type=int)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Start with base query
    query = Purchase.query
    
    # Apply filters if provided
    if vendor_id:
        query = query.filter_by(vendor_id=vendor_id)
    if start_date:
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            query = query.filter(Purchase.purchase_date >= start_date)
        except ValueError:
            return jsonify({'error': 'Invalid start_date format. Use YYYY-MM-DD'}), 400
    if end_date:
        try:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(Purchase.purchase_date <= end_date)
        except ValueError:
            return jsonify({'error': 'Invalid end_date format. Use YYYY-MM-DD'}), 400
    
    # Execute query
    purchases = query.all()
    purchases_list = []
    
    for purchase in purchases:
        purchases_list.append({
            'id': purchase.id,
            'invoice_number': purchase.invoice_number,
            'vendor_id': purchase.vendor_id,
            'vendor_name': purchase.vendor.name,
            'purchase_date': purchase.purchase_date.isoformat(),
            'total_amount': purchase.total_amount,
            'payment_status': purchase.payment_status,
            'payment_method': purchase.payment_method,
            'created_at': purchase.created_at.isoformat()
        })
    
    return jsonify(purchases_list), 200


@billing_bp.route('/purchases/<int:purchase_id>', methods=['GET'])
@jwt_required()
def get_purchase(purchase_id):
    """Get a specific purchase with its items"""
    purchase = Purchase.query.get(purchase_id)
    
    if not purchase:
        return jsonify({'error': 'Purchase not found'}), 404
    
    # Get purchase items
    items = []
    for item in purchase.items:
        items.append({
            'id': item.id,
            'product_id': item.product_id,
            'product_name': item.product.name,
            'quantity': item.quantity,
            'unit_price': item.unit_price,
            'gst_amount': item.gst_amount,
            'total_price': item.total_price
        })
    
    return jsonify({
        'id': purchase.id,
        'invoice_number': purchase.invoice_number,
        'vendor_id': purchase.vendor_id,
        'vendor_name': purchase.vendor.name,
        'vendor_gst': purchase.vendor.gst_number,
        'purchase_date': purchase.purchase_date.isoformat(),
        'total_amount': purchase.total_amount,
        'payment_status': purchase.payment_status,
        'payment_method': purchase.payment_method,
        'notes': purchase.notes,
        'items': items,
        'created_at': purchase.created_at.isoformat()
    }), 200


@billing_bp.route('/purchases', methods=['POST'])
@jwt_required()
def create_purchase():
    """Create a new purchase"""
    data = request.get_json()
    
    # Check if required fields are present
    if not data or 'vendor_id' not in data or 'items' not in data or not data['items']:
        return jsonify({'error': 'Vendor ID and purchase items are required'}), 400
    
    # Validate vendor
    vendor_id = data['vendor_id']
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({'error': 'Vendor not found'}), 400
    
    # Create new purchase
    new_purchase = Purchase(
        invoice_number=data.get('invoice_number'),
        vendor_id=vendor_id,
        purchase_date=datetime.strptime(data.get('purchase_date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
        total_amount=0,  # Will be calculated
        payment_status=data.get('payment_status', 'pending'),
        payment_method=data.get('payment_method'),
        notes=data.get('notes')
    )
    
    # Add purchase to database to get ID
    db.session.add(new_purchase)
    db.session.flush()
    
    # Process purchase items
    total_amount = 0
    
    for item_data in data['items']:
        # Validate product
        product_id = item_data.get('product_id')
        if not product_id:
            # Check if it's a new product
            if 'product_name' in item_data:
                # Create new product
                new_product = Product(
                    name=item_data['product_name'],
                    purchase_price=item_data.get('unit_price', 0),
                    selling_price=item_data.get('selling_price', 0),
                    stock_quantity=0,  # Will be updated
                    gst_percentage=item_data.get('gst_percentage', 0),
                    hsn_code=item_data.get('hsn_code'),
                    vendor_id=vendor_id
                )
                db.session.add(new_product)
                db.session.flush()
                product_id = new_product.id
            else:
                db.session.rollback()
                return jsonify({'error': 'Product ID or new product details are required'}), 400
        
        product = Product.query.get(product_id)
        if not product:
            db.session.rollback()
            return jsonify({'error': f'Product with ID {product_id} not found'}), 400
        
        # Get quantity and unit price
        quantity = item_data.get('quantity', 1)
        unit_price = item_data.get('unit_price', product.purchase_price)
        
        # Calculate GST amount
        gst_amount = item_data.get('gst_amount', 0)
        
        # Calculate total price
        total_price = (unit_price * quantity) + gst_amount
        
        # Create purchase item
        purchase_item = PurchaseItem(
            purchase_id=new_purchase.id,
            product_id=product_id,
            quantity=quantity,
            unit_price=unit_price,
            gst_amount=gst_amount,
            total_price=total_price
        )
        
        # Add purchase item to database
        db.session.add(purchase_item)
        
        # Update product stock and purchase price
        product.stock_quantity += quantity
        product.purchase_price = unit_price  # Update with latest purchase price
        
        # Update total amount
        total_amount += total_price
    
    # Update purchase with calculated total
    new_purchase.total_amount = total_amount
    
    # Commit transaction
    db.session.commit()
    
    return jsonify({
        'message': 'Purchase created successfully',
        'purchase': {
            'id': new_purchase.id,
            'invoice_number': new_purchase.invoice_number,
            'total_amount': new_purchase.total_amount
        }
    }), 201