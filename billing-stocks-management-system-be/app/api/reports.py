from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required
from app.models import Sale, SaleItem, Purchase, PurchaseItem, Product
from app import db
from datetime import datetime, timedelta
import pandas as pd
import os
import uuid
import io

reports_bp = Blueprint('reports', __name__)

# Configure reports folder
REPORTS_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'reports')
if not os.path.exists(REPORTS_FOLDER):
    os.makedirs(REPORTS_FOLDER)


@reports_bp.route('/sales', methods=['GET'])
@jwt_required()
def sales_report():
    """Generate sales report with optional filtering"""
    # Get query parameters for filtering
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    report_type = request.args.get('type', 'daily')  # 'daily', 'monthly', 'yearly'
    export_format = request.args.get('format', 'json')  # 'json', 'excel', 'csv'
    
    # Parse dates
    try:
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        else:
            # Default to last 30 days
            start_date = (datetime.now() - timedelta(days=30)).date()
        
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        else:
            end_date = datetime.now().date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    # Query sales within date range
    sales = Sale.query.filter(
        Sale.sale_date >= start_date,
        Sale.sale_date <= end_date
    ).all()
    
    # Prepare data based on report type
    if report_type == 'daily':
        # Group by day
        report_data = {}
        for sale in sales:
            date_str = sale.sale_date.strftime('%Y-%m-%d')
            if date_str not in report_data:
                report_data[date_str] = {
                    'date': date_str,
                    'total_sales': 0,
                    'total_amount': 0,
                    'total_gst': 0
                }
            report_data[date_str]['total_sales'] += 1
            report_data[date_str]['total_amount'] += sale.total_amount
            report_data[date_str]['total_gst'] += sale.gst_amount
        
        # Convert to list
        result = list(report_data.values())
        
    elif report_type == 'monthly':
        # Group by month
        report_data = {}
        for sale in sales:
            month_str = sale.sale_date.strftime('%Y-%m')
            if month_str not in report_data:
                report_data[month_str] = {
                    'month': month_str,
                    'total_sales': 0,
                    'total_amount': 0,
                    'total_gst': 0
                }
            report_data[month_str]['total_sales'] += 1
            report_data[month_str]['total_amount'] += sale.total_amount
            report_data[month_str]['total_gst'] += sale.gst_amount
        
        # Convert to list
        result = list(report_data.values())
        
    elif report_type == 'yearly':
        # Group by year
        report_data = {}
        for sale in sales:
            year_str = sale.sale_date.strftime('%Y')
            if year_str not in report_data:
                report_data[year_str] = {
                    'year': year_str,
                    'total_sales': 0,
                    'total_amount': 0,
                    'total_gst': 0
                }
            report_data[year_str]['total_sales'] += 1
            report_data[year_str]['total_amount'] += sale.total_amount
            report_data[year_str]['total_gst'] += sale.gst_amount
        
        # Convert to list
        result = list(report_data.values())
    
    else:
        return jsonify({'error': 'Invalid report type'}), 400
    
    # Calculate summary
    summary = {
        'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
        'total_sales': sum(item['total_sales'] for item in result),
        'total_amount': sum(item['total_amount'] for item in result),
        'total_gst': sum(item['total_gst'] for item in result)
    }
    
    # Return based on requested format
    if export_format == 'json':
        return jsonify({
            'summary': summary,
            'data': result
        }), 200
    
    elif export_format in ['excel', 'csv']:
        # Create DataFrame
        df = pd.DataFrame(result)
        
        # Create file
        filename = f"sales_report_{report_type}_{uuid.uuid4()}"
        file_path = os.path.join(REPORTS_FOLDER, filename)
        
        # Export to requested format
        if export_format == 'excel':
            # Add summary sheet
            with pd.ExcelWriter(file_path + '.xlsx') as writer:
                df.to_excel(writer, sheet_name='Sales Data', index=False)
                pd.DataFrame([summary]).to_excel(writer, sheet_name='Summary', index=False)
            
            # Return file
            return send_file(
                file_path + '.xlsx',
                as_attachment=True,
                download_name=f"sales_report_{report_type}.xlsx",
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
        
        else:  # CSV
            df.to_csv(file_path + '.csv', index=False)
            
            # Return file
            return send_file(
                file_path + '.csv',
                as_attachment=True,
                download_name=f"sales_report_{report_type}.csv",
                mimetype='text/csv'
            )
    
    else:
        return jsonify({'error': 'Invalid export format'}), 400


@reports_bp.route('/purchases', methods=['GET'])
@jwt_required()
def purchases_report():
    """Generate purchases report with optional filtering"""
    # Get query parameters for filtering
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    report_type = request.args.get('type', 'daily')  # 'daily', 'monthly', 'yearly'
    export_format = request.args.get('format', 'json')  # 'json', 'excel', 'csv'
    
    # Parse dates
    try:
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        else:
            # Default to last 30 days
            start_date = (datetime.now() - timedelta(days=30)).date()
        
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        else:
            end_date = datetime.now().date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    # Query purchases within date range
    purchases = Purchase.query.filter(
        Purchase.purchase_date >= start_date,
        Purchase.purchase_date <= end_date
    ).all()
    
    # Prepare data based on report type
    if report_type == 'daily':
        # Group by day
        report_data = {}
        for purchase in purchases:
            date_str = purchase.purchase_date.strftime('%Y-%m-%d')
            if date_str not in report_data:
                report_data[date_str] = {
                    'date': date_str,
                    'total_purchases': 0,
                    'total_amount': 0
                }
            report_data[date_str]['total_purchases'] += 1
            report_data[date_str]['total_amount'] += purchase.total_amount
        
        # Convert to list
        result = list(report_data.values())
        
    elif report_type == 'monthly':
        # Group by month
        report_data = {}
        for purchase in purchases:
            month_str = purchase.purchase_date.strftime('%Y-%m')
            if month_str not in report_data:
                report_data[month_str] = {
                    'month': month_str,
                    'total_purchases': 0,
                    'total_amount': 0
                }
            report_data[month_str]['total_purchases'] += 1
            report_data[month_str]['total_amount'] += purchase.total_amount
        
        # Convert to list
        result = list(report_data.values())
        
    elif report_type == 'yearly':
        # Group by year
        report_data = {}
        for purchase in purchases:
            year_str = purchase.purchase_date.strftime('%Y')
            if year_str not in report_data:
                report_data[year_str] = {
                    'year': year_str,
                    'total_purchases': 0,
                    'total_amount': 0
                }
            report_data[year_str]['total_purchases'] += 1
            report_data[year_str]['total_amount'] += purchase.total_amount
        
        # Convert to list
        result = list(report_data.values())
    
    else:
        return jsonify({'error': 'Invalid report type'}), 400
    
    # Calculate summary
    summary = {
        'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
        'total_purchases': sum(item['total_purchases'] for item in result),
        'total_amount': sum(item['total_amount'] for item in result)
    }
    
    # Return based on requested format
    if export_format == 'json':
        return jsonify({
            'summary': summary,
            'data': result
        }), 200
    
    elif export_format in ['excel', 'csv']:
        # Create DataFrame
        df = pd.DataFrame(result)
        
        # Create file
        filename = f"purchases_report_{report_type}_{uuid.uuid4()}"
        file_path = os.path.join(REPORTS_FOLDER, filename)
        
        # Export to requested format
        if export_format == 'excel':
            # Add summary sheet
            with pd.ExcelWriter(file_path + '.xlsx') as writer:
                df.to_excel(writer, sheet_name='Purchases Data', index=False)
                pd.DataFrame([summary]).to_excel(writer, sheet_name='Summary', index=False)
            
            # Return file
            return send_file(
                file_path + '.xlsx',
                as_attachment=True,
                download_name=f"purchases_report_{report_type}.xlsx",
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
        
        else:  # CSV
            df.to_csv(file_path + '.csv', index=False)
            
            # Return file
            return send_file(
                file_path + '.csv',
                as_attachment=True,
                download_name=f"purchases_report_{report_type}.csv",
                mimetype='text/csv'
            )
    
    else:
        return jsonify({'error': 'Invalid export format'}), 400


@reports_bp.route('/gst', methods=['GET'])
@jwt_required()
def gst_report():
    """Generate GST report with optional filtering"""
    # Get query parameters for filtering
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    report_type = request.args.get('type', 'sales')  # 'sales', 'purchases', 'both'
    export_format = request.args.get('format', 'json')  # 'json', 'excel', 'csv'
    
    # Parse dates
    try:
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        else:
            # Default to current month
            today = datetime.now().date()
            start_date = datetime(today.year, today.month, 1).date()
        
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        else:
            end_date = datetime.now().date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    result = {}
    
    # Get sales GST data if requested
    if report_type in ['sales', 'both']:
        # Query sales within date range
        sales = Sale.query.filter(
            Sale.sale_date >= start_date,
            Sale.sale_date <= end_date
        ).all()
        
        # Get all sale items
        sale_items = []
        for sale in sales:
            for item in sale.items:
                sale_items.append({
                    'invoice_number': sale.invoice_number,
                    'date': sale.sale_date.strftime('%Y-%m-%d'),
                    'product_name': item.product.name,
                    'hsn_code': item.product.hsn_code,
                    'quantity': item.quantity,
                    'unit_price': item.unit_price,
                    'gst_percentage': item.gst_percentage,
                    'gst_amount': item.gst_amount,
                    'total_price': item.total_price
                })
        
        # Group by GST percentage
        sales_gst_data = {}
        for item in sale_items:
            gst_key = str(item['gst_percentage'])
            if gst_key not in sales_gst_data:
                sales_gst_data[gst_key] = {
                    'gst_percentage': item['gst_percentage'],
                    'taxable_amount': 0,
                    'gst_amount': 0,
                    'total_amount': 0
                }
            
            # Calculate taxable amount (price before GST)
            taxable_amount = item['total_price'] - item['gst_amount']
            
            sales_gst_data[gst_key]['taxable_amount'] += taxable_amount
            sales_gst_data[gst_key]['gst_amount'] += item['gst_amount']
            sales_gst_data[gst_key]['total_amount'] += item['total_price']
        
        result['sales_gst'] = list(sales_gst_data.values())
    
    # Get purchases GST data if requested
    if report_type in ['purchases', 'both']:
        # Query purchases within date range
        purchases = Purchase.query.filter(
            Purchase.purchase_date >= start_date,
            Purchase.purchase_date <= end_date
        ).all()
        
        # Get all purchase items
        purchase_items = []
        for purchase in purchases:
            for item in purchase.items:
                purchase_items.append({
                    'invoice_number': purchase.invoice_number,
                    'date': purchase.purchase_date.strftime('%Y-%m-%d'),
                    'product_name': item.product.name,
                    'hsn_code': item.product.hsn_code,
                    'quantity': item.quantity,
                    'unit_price': item.unit_price,
                    'gst_amount': item.gst_amount,
                    'total_price': item.total_price
                })
        
        # Group by GST amount
        purchases_gst_data = {}
        for item in purchase_items:
            # Calculate approximate GST percentage
            taxable_amount = item['total_price'] - item['gst_amount']
            if taxable_amount > 0:
                gst_percentage = round((item['gst_amount'] / taxable_amount) * 100, 2)
            else:
                gst_percentage = 0
            
            gst_key = str(gst_percentage)
            if gst_key not in purchases_gst_data:
                purchases_gst_data[gst_key] = {
                    'gst_percentage': gst_percentage,
                    'taxable_amount': 0,
                    'gst_amount': 0,
                    'total_amount': 0
                }
            
            purchases_gst_data[gst_key]['taxable_amount'] += taxable_amount
            purchases_gst_data[gst_key]['gst_amount'] += item['gst_amount']
            purchases_gst_data[gst_key]['total_amount'] += item['total_price']
        
        result['purchases_gst'] = list(purchases_gst_data.values())
    
    # Calculate summary
    summary = {
        'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
        'report_type': report_type
    }
    
    if report_type in ['sales', 'both'] and 'sales_gst' in result:
        summary['sales_taxable_amount'] = sum(item['taxable_amount'] for item in result['sales_gst'])
        summary['sales_gst_amount'] = sum(item['gst_amount'] for item in result['sales_gst'])
        summary['sales_total_amount'] = sum(item['total_amount'] for item in result['sales_gst'])
    
    if report_type in ['purchases', 'both'] and 'purchases_gst' in result:
        summary['purchases_taxable_amount'] = sum(item['taxable_amount'] for item in result['purchases_gst'])
        summary['purchases_gst_amount'] = sum(item['gst_amount'] for item in result['purchases_gst'])
        summary['purchases_total_amount'] = sum(item['total_amount'] for item in result['purchases_gst'])
    
    if report_type == 'both' and 'sales_gst' in result and 'purchases_gst' in result:
        summary['net_gst'] = summary['sales_gst_amount'] - summary['purchases_gst_amount']
    
    # Return based on requested format
    if export_format == 'json':
        return jsonify({
            'summary': summary,
            'data': result
        }), 200
    
    elif export_format in ['excel', 'csv']:
        # Create file
        filename = f"gst_report_{report_type}_{uuid.uuid4()}"
        file_path = os.path.join(REPORTS_FOLDER, filename)
        
        # Export to requested format
        if export_format == 'excel':
            with pd.ExcelWriter(file_path + '.xlsx') as writer:
                # Add summary sheet
                pd.DataFrame([summary]).to_excel(writer, sheet_name='Summary', index=False)
                
                # Add data sheets
                if report_type in ['sales', 'both'] and 'sales_gst' in result:
                    pd.DataFrame(result['sales_gst']).to_excel(writer, sheet_name='Sales GST', index=False)
                
                if report_type in ['purchases', 'both'] and 'purchases_gst' in result:
                    pd.DataFrame(result['purchases_gst']).to_excel(writer, sheet_name='Purchases GST', index=False)
            
            # Return file
            return send_file(
                file_path + '.xlsx',
                as_attachment=True,
                download_name=f"gst_report_{report_type}.xlsx",
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
        
        else:  # CSV
            # For CSV, we'll combine all data into one file
            all_data = []
            
            if report_type in ['sales', 'both'] and 'sales_gst' in result:
                for item in result['sales_gst']:
                    item['type'] = 'sales'
                    all_data.append(item)
            
            if report_type in ['purchases', 'both'] and 'purchases_gst' in result:
                for item in result['purchases_gst']:
                    item['type'] = 'purchases'
                    all_data.append(item)
            
            pd.DataFrame(all_data).to_csv(file_path + '.csv', index=False)
            
            # Return file
            return send_file(
                file_path + '.csv',
                as_attachment=True,
                download_name=f"gst_report_{report_type}.csv",
                mimetype='text/csv'
            )
    
    else:
        return jsonify({'error': 'Invalid export format'}), 400


@reports_bp.route('/inventory', methods=['GET'])
@jwt_required()
def inventory_report():
    """Generate inventory report"""
    # Get query parameters
    category_id = request.args.get('category_id', type=int)
    low_stock = request.args.get('low_stock', type=bool, default=False)
    export_format = request.args.get('format', 'json')  # 'json', 'excel', 'csv'
    
    # Start with base query
    query = Product.query
    
    # Apply filters if provided
    if category_id:
        query = query.filter_by(category_id=category_id)
    if low_stock:
        query = query.filter(Product.stock_quantity <= Product.low_stock_threshold)
    
    # Execute query
    products = query.all()
    
    # Prepare data
    inventory_data = []
    for product in products:
        inventory_data.append({
            'id': product.id,
            'name': product.name,
            'sku': product.sku,
            'category': product.category.name if product.category else None,
            'stock_quantity': product.stock_quantity,
            'low_stock_threshold': product.low_stock_threshold,
            'purchase_price': product.purchase_price,
            'selling_price': product.selling_price,
            'stock_value': product.stock_quantity * product.purchase_price,
            'potential_sales_value': product.stock_quantity * product.selling_price,
            'potential_profit': product.stock_quantity * (product.selling_price - product.purchase_price)
        })
    
    # Calculate summary
    summary = {
        'total_products': len(inventory_data),
        'total_stock_value': sum(item['stock_value'] for item in inventory_data),
        'total_potential_sales': sum(item['potential_sales_value'] for item in inventory_data),
        'total_potential_profit': sum(item['potential_profit'] for item in inventory_data),
        'low_stock_items': sum(1 for item in inventory_data if item['stock_quantity'] <= item['low_stock_threshold'])
    }
    
    # Return based on requested format
    if export_format == 'json':
        return jsonify({
            'summary': summary,
            'data': inventory_data
        }), 200
    
    elif export_format in ['excel', 'csv']:
        # Create DataFrame
        df = pd.DataFrame(inventory_data)
        
        # Create file
        filename = f"inventory_report_{uuid.uuid4()}"
        file_path = os.path.join(REPORTS_FOLDER, filename)
        
        # Export to requested format
        if export_format == 'excel':
            # Add summary sheet
            with pd.ExcelWriter(file_path + '.xlsx') as writer:
                df.to_excel(writer, sheet_name='Inventory Data', index=False)
                pd.DataFrame([summary]).to_excel(writer, sheet_name='Summary', index=False)
            
            # Return file
            return send_file(
                file_path + '.xlsx',
                as_attachment=True,
                download_name="inventory_report.xlsx",
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
        
        else:  # CSV
            df.to_csv(file_path + '.csv', index=False)
            
            # Return file
            return send_file(
                file_path + '.csv',
                as_attachment=True,
                download_name="inventory_report.csv",
                mimetype='text/csv'
            )
    
    else:
        return jsonify({'error': 'Invalid export format'}), 400