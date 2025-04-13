from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import Product, Category, Vendor
from app import db

inventory_bp = Blueprint('inventory', __name__)

# Category routes
@inventory_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Get all categories"""
    categories = Category.query.all()
    categories_list = []
    
    for category in categories:
        categories_list.append({
            'id': category.id,
            'name': category.name,
            'description': category.description
        })
    
    return jsonify(categories_list), 200


@inventory_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    """Create a new category"""
    data = request.get_json()
    
    # Check if required fields are present
    if not data or 'name' not in data:
        return jsonify({'error': 'Category name is required'}), 400
    
    # Check if category already exists
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Category already exists'}), 400
    
    # Create new category
    new_category = Category(
        name=data['name'],
        description=data.get('description')
    )
    
    # Save to database
    db.session.add(new_category)
    db.session.commit()
    
    return jsonify({
        'message': 'Category created successfully',
        'category': {
            'id': new_category.id,
            'name': new_category.name,
            'description': new_category.description
        }
    }), 201


@inventory_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    """Update a category"""
    category = Category.query.get(category_id)
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    data = request.get_json()
    
    # Update category fields
    if 'name' in data:
        # Check if name already exists for another category
        existing_category = Category.query.filter_by(name=data['name']).first()
        if existing_category and existing_category.id != category_id:
            return jsonify({'error': 'Category name already exists'}), 400
        category.name = data['name']
    if 'description' in data:
        category.description = data['description']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Category updated successfully',
        'category': {
            'id': category.id,
            'name': category.name,
            'description': category.description
        }
    }), 200


@inventory_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    """Delete a category"""
    category = Category.query.get(category_id)
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    # Check if category has associated products
    if category.products:
        return jsonify({
            'error': 'Cannot delete category with associated products'
        }), 400
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({'message': 'Category deleted successfully'}), 200


# Product routes
@inventory_bp.route('/products', methods=['GET'])
@jwt_required()
def get_products():
    """Get all products with optional filtering"""
    # Get query parameters for filtering
    category_id = request.args.get('category_id', type=int)
    vendor_id = request.args.get('vendor_id', type=int)
    low_stock = request.args.get('low_stock', type=bool, default=False)
    
    # Start with base query
    query = Product.query
    
    # Apply filters if provided
    if category_id:
        query = query.filter_by(category_id=category_id)
    if vendor_id:
        query = query.filter_by(vendor_id=vendor_id)
    if low_stock:
        query = query.filter(Product.stock_quantity <= Product.low_stock_threshold)
    
    # Execute query
    products = query.all()
    products_list = []
    
    for product in products:
        products_list.append({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'sku': product.sku,
            'barcode': product.barcode,
            'purchase_price': product.purchase_price,
            'selling_price': product.selling_price,
            'wholesale_price': product.wholesale_price,
            'stock_quantity': product.stock_quantity,
            'low_stock_threshold': product.low_stock_threshold,
            'gst_percentage': product.gst_percentage,
            'hsn_code': product.hsn_code,
            'category_id': product.category_id,
            'category_name': product.category.name if product.category else None,
            'vendor_id': product.vendor_id,
            'vendor_name': product.vendor.name if product.vendor else None,
            'created_at': product.created_at.isoformat()
        })
    
    return jsonify(products_list), 200


@inventory_bp.route('/products/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    """Get a specific product"""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'sku': product.sku,
        'barcode': product.barcode,
        'purchase_price': product.purchase_price,
        'selling_price': product.selling_price,
        'wholesale_price': product.wholesale_price,
        'stock_quantity': product.stock_quantity,
        'low_stock_threshold': product.low_stock_threshold,
        'gst_percentage': product.gst_percentage,
        'hsn_code': product.hsn_code,
        'category_id': product.category_id,
        'category_name': product.category.name if product.category else None,
        'vendor_id': product.vendor_id,
        'vendor_name': product.vendor.name if product.vendor else None,
        'created_at': product.created_at.isoformat()
    }), 200


@inventory_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    """Create a new product"""
    data = request.get_json()
    
    # Check if required fields are present
    required_fields = ['name', 'purchase_price', 'selling_price']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if category exists if provided
    category_id = data.get('category_id')
    if category_id and not Category.query.get(category_id):
        return jsonify({'error': 'Category not found'}), 400
    
    # Check if vendor exists if provided
    vendor_id = data.get('vendor_id')
    if vendor_id and not Vendor.query.get(vendor_id):
        return jsonify({'error': 'Vendor not found'}), 400
    
    # Create new product
    new_product = Product(
        name=data['name'],
        description=data.get('description'),
        sku=data.get('sku'),
        barcode=data.get('barcode'),
        purchase_price=data['purchase_price'],
        selling_price=data['selling_price'],
        wholesale_price=data.get('wholesale_price'),
        stock_quantity=data.get('stock_quantity', 0),
        low_stock_threshold=data.get('low_stock_threshold', 10),
        gst_percentage=data.get('gst_percentage', 0),
        hsn_code=data.get('hsn_code'),
        category_id=category_id,
        vendor_id=vendor_id
    )
    
    # Save to database
    db.session.add(new_product)
    db.session.commit()
    
    return jsonify({
        'message': 'Product created successfully',
        'product': {
            'id': new_product.id,
            'name': new_product.name,
            'purchase_price': new_product.purchase_price,
            'selling_price': new_product.selling_price,
            'stock_quantity': new_product.stock_quantity
        }
    }), 201


@inventory_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update a product"""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    # Check if category exists if provided
    category_id = data.get('category_id')
    if category_id and not Category.query.get(category_id):
        return jsonify({'error': 'Category not found'}), 400
    
    # Check if vendor exists if provided
    vendor_id = data.get('vendor_id')
    if vendor_id and not Vendor.query.get(vendor_id):
        return jsonify({'error': 'Vendor not found'}), 400
    
    # Update product fields
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'sku' in data:
        product.sku = data['sku']
    if 'barcode' in data:
        product.barcode = data['barcode']
    if 'purchase_price' in data:
        product.purchase_price = data['purchase_price']
    if 'selling_price' in data:
        product.selling_price = data['selling_price']
    if 'wholesale_price' in data:
        product.wholesale_price = data['wholesale_price']
    if 'stock_quantity' in data:
        product.stock_quantity = data['stock_quantity']
    if 'low_stock_threshold' in data:
        product.low_stock_threshold = data['low_stock_threshold']
    if 'gst_percentage' in data:
        product.gst_percentage = data['gst_percentage']
    if 'hsn_code' in data:
        product.hsn_code = data['hsn_code']
    if 'category_id' in data:
        product.category_id = category_id
    if 'vendor_id' in data:
        product.vendor_id = vendor_id
    
    db.session.commit()
    
    return jsonify({
        'message': 'Product updated successfully',
        'product': {
            'id': product.id,
            'name': product.name,
            'purchase_price': product.purchase_price,
            'selling_price': product.selling_price,
            'stock_quantity': product.stock_quantity
        }
    }), 200


@inventory_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete a product"""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Check if product has associated purchase or sale items
    if product.purchase_items or product.sale_items:
        return jsonify({
            'error': 'Cannot delete product with associated purchase or sale records'
        }), 400
    
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': 'Product deleted successfully'}), 200


@inventory_bp.route('/products/low-stock', methods=['GET'])
@jwt_required()
def get_low_stock_products():
    """Get products with stock below threshold"""
    products = Product.query.filter(Product.stock_quantity <= Product.low_stock_threshold).all()
    products_list = []
    
    for product in products:
        products_list.append({
            'id': product.id,
            'name': product.name,
            'stock_quantity': product.stock_quantity,
            'low_stock_threshold': product.low_stock_threshold,
            'category_name': product.category.name if product.category else None,
            'vendor_name': product.vendor.name if product.vendor else None
        })
    
    return jsonify(products_list), 200