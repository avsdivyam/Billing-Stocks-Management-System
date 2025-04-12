from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import Vendor
from app import db

vendors_bp = Blueprint('vendors', __name__)

@vendors_bp.route('/', methods=['GET'])
@jwt_required()
def get_vendors():
    """Get all vendors"""
    vendors = Vendor.query.all()
    vendors_list = []
    
    for vendor in vendors:
        vendors_list.append({
            'id': vendor.id,
            'name': vendor.name,
            'contact_person': vendor.contact_person,
            'phone': vendor.phone,
            'email': vendor.email,
            'address': vendor.address,
            'gst_number': vendor.gst_number,
            'created_at': vendor.created_at.isoformat()
        })
    
    return jsonify(vendors_list), 200


@vendors_bp.route('/<int:vendor_id>', methods=['GET'])
@jwt_required()
def get_vendor(vendor_id):
    """Get a specific vendor"""
    vendor = Vendor.query.get(vendor_id)
    
    if not vendor:
        return jsonify({'error': 'Vendor not found'}), 404
    
    return jsonify({
        'id': vendor.id,
        'name': vendor.name,
        'contact_person': vendor.contact_person,
        'phone': vendor.phone,
        'email': vendor.email,
        'address': vendor.address,
        'gst_number': vendor.gst_number,
        'created_at': vendor.created_at.isoformat()
    }), 200


@vendors_bp.route('/', methods=['POST'])
@jwt_required()
def create_vendor():
    """Create a new vendor"""
    data = request.get_json()
    
    # Check if required fields are present
    if not data or 'name' not in data:
        return jsonify({'error': 'Vendor name is required'}), 400
    
    # Create new vendor
    new_vendor = Vendor(
        name=data['name'],
        contact_person=data.get('contact_person'),
        phone=data.get('phone'),
        email=data.get('email'),
        address=data.get('address'),
        gst_number=data.get('gst_number')
    )
    
    # Save to database
    db.session.add(new_vendor)
    db.session.commit()
    
    return jsonify({
        'message': 'Vendor created successfully',
        'vendor': {
            'id': new_vendor.id,
            'name': new_vendor.name,
            'contact_person': new_vendor.contact_person,
            'phone': new_vendor.phone,
            'email': new_vendor.email,
            'address': new_vendor.address,
            'gst_number': new_vendor.gst_number
        }
    }), 201


@vendors_bp.route('/<int:vendor_id>', methods=['PUT'])
@jwt_required()
def update_vendor(vendor_id):
    """Update a vendor"""
    vendor = Vendor.query.get(vendor_id)
    
    if not vendor:
        return jsonify({'error': 'Vendor not found'}), 404
    
    data = request.get_json()
    
    # Update vendor fields
    if 'name' in data:
        vendor.name = data['name']
    if 'contact_person' in data:
        vendor.contact_person = data['contact_person']
    if 'phone' in data:
        vendor.phone = data['phone']
    if 'email' in data:
        vendor.email = data['email']
    if 'address' in data:
        vendor.address = data['address']
    if 'gst_number' in data:
        vendor.gst_number = data['gst_number']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Vendor updated successfully',
        'vendor': {
            'id': vendor.id,
            'name': vendor.name,
            'contact_person': vendor.contact_person,
            'phone': vendor.phone,
            'email': vendor.email,
            'address': vendor.address,
            'gst_number': vendor.gst_number
        }
    }), 200


@vendors_bp.route('/<int:vendor_id>', methods=['DELETE'])
@jwt_required()
def delete_vendor(vendor_id):
    """Delete a vendor"""
    vendor = Vendor.query.get(vendor_id)
    
    if not vendor:
        return jsonify({'error': 'Vendor not found'}), 404
    
    # Check if vendor has associated products or purchases
    if vendor.products or vendor.purchases:
        return jsonify({
            'error': 'Cannot delete vendor with associated products or purchases'
        }), 400
    
    db.session.delete(vendor)
    db.session.commit()
    
    return jsonify({'message': 'Vendor deleted successfully'}), 200