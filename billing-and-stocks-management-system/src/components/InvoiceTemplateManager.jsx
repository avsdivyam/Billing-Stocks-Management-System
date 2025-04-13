import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiCopy, FiDownload, FiUpload, FiEye, FiCheck } from 'react-icons/fi';
import { Card, Button, Input, Modal } from './ui';

/**
 * Invoice Template Manager Component
 * 
 * This component allows users to manage invoice templates, including:
 * - Viewing available templates
 * - Selecting a default template
 * - Creating new templates
 * - Editing existing templates
 * - Deleting templates
 * - Importing/exporting templates
 */
const InvoiceTemplateManager = ({ onTemplateChange }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [defaultTemplate, setDefaultTemplate] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [templateToPreview, setTemplateToPreview] = useState(null);
  
  // Form state for creating/editing templates
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    html: '',
    css: '',
    isCustom: true,
  });
  
  // Load templates from localStorage or use defaults
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem('invoiceTemplates');
      const savedDefaultTemplate = localStorage.getItem('defaultInvoiceTemplate');
      
      if (savedTemplates) {
        const parsedTemplates = JSON.parse(savedTemplates);
        setTemplates(parsedTemplates);
        
        if (savedDefaultTemplate) {
          setDefaultTemplate(savedDefaultTemplate);
          setSelectedTemplate(savedDefaultTemplate);
          
          // Notify parent component of the default template
          if (onTemplateChange) {
            const template = parsedTemplates.find(t => t.id === savedDefaultTemplate);
            if (template) {
              onTemplateChange(template);
            }
          }
        } else if (parsedTemplates.length > 0) {
          // If no default is set but templates exist, use the first one
          setDefaultTemplate(parsedTemplates[0].id);
          setSelectedTemplate(parsedTemplates[0].id);
          
          // Notify parent component
          if (onTemplateChange) {
            onTemplateChange(parsedTemplates[0]);
          }
        }
      } else {
        // Load default templates
        const defaultTemplates = getDefaultTemplates();
        setTemplates(defaultTemplates);
        setDefaultTemplate(defaultTemplates[0].id);
        setSelectedTemplate(defaultTemplates[0].id);
        
        // Save to localStorage
        localStorage.setItem('invoiceTemplates', JSON.stringify(defaultTemplates));
        localStorage.setItem('defaultInvoiceTemplate', defaultTemplates[0].id);
        
        // Notify parent component
        if (onTemplateChange) {
          onTemplateChange(defaultTemplates[0]);
        }
      }
    } catch (error) {
      console.error('Error loading invoice templates:', error);
      
      // Fallback to default templates
      const defaultTemplates = getDefaultTemplates();
      setTemplates(defaultTemplates);
      setDefaultTemplate(defaultTemplates[0].id);
      setSelectedTemplate(defaultTemplates[0].id);
    }
  }, [onTemplateChange]);
  
  // Get default templates
  const getDefaultTemplates = () => {
    return [
      {
        id: 'default',
        name: 'Default Template',
        description: 'A clean, professional invoice template',
        preview: '/templates/default.png',
        html: getDefaultTemplateHTML(),
        css: getDefaultTemplateCSS(),
        isCustom: false,
        isDefault: true,
      },
      {
        id: 'modern',
        name: 'Modern Template',
        description: 'A modern, sleek invoice design',
        preview: '/templates/modern.png',
        html: getModernTemplateHTML(),
        css: getModernTemplateCSS(),
        isCustom: false,
        isDefault: false,
      },
      {
        id: 'minimal',
        name: 'Minimal Template',
        description: 'A simple, minimalist invoice layout',
        preview: '/templates/minimal.png',
        html: getMinimalTemplateHTML(),
        css: getMinimalTemplateCSS(),
        isCustom: false,
        isDefault: false,
      },
    ];
  };
  
  // Handle template selection
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    
    // Find the selected template
    const template = templates.find(t => t.id === templateId);
    if (template && onTemplateChange) {
      onTemplateChange(template);
    }
  };
  
  // Set a template as default
  const handleSetDefault = (templateId) => {
    setDefaultTemplate(templateId);
    localStorage.setItem('defaultInvoiceTemplate', templateId);
    
    // Update the templates array to reflect the new default
    const updatedTemplates = templates.map(template => ({
      ...template,
      isDefault: template.id === templateId,
    }));
    
    setTemplates(updatedTemplates);
    localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
    
    // Notify parent component
    if (onTemplateChange) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        onTemplateChange(template);
      }
    }
  };
  
  // Open create template modal
  const handleCreateTemplate = () => {
    setTemplateForm({
      name: '',
      description: '',
      html: getDefaultTemplateHTML(),
      css: getDefaultTemplateCSS(),
      isCustom: true,
    });
    setIsCreateModalOpen(true);
  };
  
  // Open edit template modal
  const handleEditTemplate = (template) => {
    setTemplateToEdit(template);
    setTemplateForm({
      name: template.name,
      description: template.description || '',
      html: template.html,
      css: template.css,
      isCustom: template.isCustom,
    });
    setIsEditModalOpen(true);
  };
  
  // Open delete template confirmation modal
  const handleDeleteTemplate = (template) => {
    setTemplateToDelete(template);
    setIsDeleteModalOpen(true);
  };
  
  // Open template preview modal
  const handlePreviewTemplate = (template) => {
    setTemplateToPreview(template);
    setIsPreviewModalOpen(true);
  };
  
  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTemplateForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Save a new template
  const handleSaveNewTemplate = () => {
    // Generate a unique ID
    const newId = `template_${Date.now()}`;
    
    // Create the new template object
    const newTemplate = {
      id: newId,
      name: templateForm.name,
      description: templateForm.description,
      html: templateForm.html,
      css: templateForm.css,
      isCustom: true,
      isDefault: false,
      preview: '/templates/custom.png', // Default preview image for custom templates
    };
    
    // Add to templates array
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    
    // Save to localStorage
    localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
    
    // Close the modal
    setIsCreateModalOpen(false);
    
    // Select the new template
    setSelectedTemplate(newId);
    
    // Notify parent component
    if (onTemplateChange) {
      onTemplateChange(newTemplate);
    }
  };
  
  // Update an existing template
  const handleUpdateTemplate = () => {
    if (!templateToEdit) return;
    
    // Update the template
    const updatedTemplates = templates.map(template => {
      if (template.id === templateToEdit.id) {
        return {
          ...template,
          name: templateForm.name,
          description: templateForm.description,
          html: templateForm.html,
          css: templateForm.css,
        };
      }
      return template;
    });
    
    setTemplates(updatedTemplates);
    
    // Save to localStorage
    localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
    
    // Close the modal
    setIsEditModalOpen(false);
    
    // If the updated template is the selected one, notify parent component
    if (selectedTemplate === templateToEdit.id && onTemplateChange) {
      const updatedTemplate = updatedTemplates.find(t => t.id === templateToEdit.id);
      if (updatedTemplate) {
        onTemplateChange(updatedTemplate);
      }
    }
  };
  
  // Confirm template deletion
  const handleConfirmDelete = () => {
    if (!templateToDelete) return;
    
    // Check if the template to delete is the default
    const isDefaultTemplate = templateToDelete.id === defaultTemplate;
    
    // Remove the template
    const updatedTemplates = templates.filter(template => template.id !== templateToDelete.id);
    setTemplates(updatedTemplates);
    
    // Save to localStorage
    localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
    
    // If the deleted template was the default, set a new default
    if (isDefaultTemplate && updatedTemplates.length > 0) {
      setDefaultTemplate(updatedTemplates[0].id);
      localStorage.setItem('defaultInvoiceTemplate', updatedTemplates[0].id);
      
      // Notify parent component
      if (onTemplateChange) {
        onTemplateChange(updatedTemplates[0]);
      }
    }
    
    // If the deleted template was the selected one, select the new default
    if (selectedTemplate === templateToDelete.id) {
      if (updatedTemplates.length > 0) {
        setSelectedTemplate(isDefaultTemplate ? updatedTemplates[0].id : defaultTemplate);
      } else {
        setSelectedTemplate(null);
      }
    }
    
    // Close the modal
    setIsDeleteModalOpen(false);
  };
  
  // Duplicate a template
  const handleDuplicateTemplate = (template) => {
    // Generate a unique ID
    const newId = `template_${Date.now()}`;
    
    // Create the duplicate template
    const duplicateTemplate = {
      ...template,
      id: newId,
      name: `${template.name} (Copy)`,
      isCustom: true,
      isDefault: false,
    };
    
    // Add to templates array
    const updatedTemplates = [...templates, duplicateTemplate];
    setTemplates(updatedTemplates);
    
    // Save to localStorage
    localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
    
    // Select the new template
    setSelectedTemplate(newId);
    
    // Notify parent component
    if (onTemplateChange) {
      onTemplateChange(duplicateTemplate);
    }
  };
  
  // Export a template as JSON
  const handleExportTemplate = (template) => {
    const templateData = JSON.stringify(template, null, 2);
    const blob = new Blob([templateData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '_')}_template.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Import a template from JSON file
  const handleImportTemplate = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTemplate = JSON.parse(event.target.result);
        
        // Validate the imported template
        if (!importedTemplate.name || !importedTemplate.html || !importedTemplate.css) {
          alert('Invalid template file. The file must contain name, html, and css properties.');
          return;
        }
        
        // Generate a unique ID
        const newId = `template_${Date.now()}`;
        
        // Create the new template object
        const newTemplate = {
          ...importedTemplate,
          id: newId,
          isCustom: true,
          isDefault: false,
          preview: importedTemplate.preview || '/templates/custom.png',
        };
        
        // Add to templates array
        const updatedTemplates = [...templates, newTemplate];
        setTemplates(updatedTemplates);
        
        // Save to localStorage
        localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
        
        // Select the new template
        setSelectedTemplate(newId);
        
        // Notify parent component
        if (onTemplateChange) {
          onTemplateChange(newTemplate);
        }
      } catch (error) {
        console.error('Error importing template:', error);
        alert('Failed to import template. Please make sure the file is a valid JSON template.');
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    e.target.value = null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Invoice Templates</h2>
          <p className="text-sm text-gray-600">
            Manage your invoice templates and set a default template for all invoices.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            onClick={handleCreateTemplate}
          >
            <FiPlus className="mr-2" />
            Create Template
          </Button>
          
          <label className="cursor-pointer">
            <Button
              variant="outline"
              as="div"
            >
              <FiUpload className="mr-2" />
              Import Template
            </Button>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportTemplate}
            />
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className={`overflow-hidden ${selectedTemplate === template.id ? 'ring-2 ring-primary-500' : ''}`}>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 border-b">
              <img
                src={template.preview || '/templates/default.png'}
                alt={template.name}
                className="object-cover w-full h-full"
              />
              {template.isDefault && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Default
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{template.name}</h3>
                  {template.description && (
                    <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                  )}
                </div>
                {selectedTemplate === template.id && (
                  <div className="flex-shrink-0 h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiCheck className="h-4 w-4 text-primary-600" />
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant={selectedTemplate === template.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  {selectedTemplate === template.id ? 'Selected' : 'Select'}
                </Button>
                
                {selectedTemplate === template.id && !template.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(template.id)}
                  >
                    Set as Default
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreviewTemplate(template)}
                >
                  <FiEye className="mr-1" />
                  Preview
                </Button>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {template.isCustom && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <FiEdit className="mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-danger-600 hover:bg-danger-50"
                      onClick={() => handleDeleteTemplate(template)}
                    >
                      <FiTrash2 className="mr-1" />
                      Delete
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicateTemplate(template)}
                >
                  <FiCopy className="mr-1" />
                  Duplicate
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportTemplate(template)}
                >
                  <FiDownload className="mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Create Template Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Template"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <Input
              id="name"
              name="name"
              value={templateForm.name}
              onChange={handleFormChange}
              placeholder="Enter template name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <Input
              id="description"
              name="description"
              value={templateForm.description}
              onChange={handleFormChange}
              placeholder="Enter template description"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="html" className="block text-sm font-medium text-gray-700 mb-1">
                HTML Template
              </label>
              <textarea
                id="html"
                name="html"
                value={templateForm.html}
                onChange={handleFormChange}
                rows={10}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="Enter HTML template code"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Use placeholders like {'{company_name}'}, {'{invoice_number}'}, etc.
              </p>
            </div>
            
            <div>
              <label htmlFor="css" className="block text-sm font-medium text-gray-700 mb-1">
                CSS Styles
              </label>
              <textarea
                id="css"
                name="css"
                value={templateForm.css}
                onChange={handleFormChange}
                rows={10}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="Enter CSS styles"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveNewTemplate}
            disabled={!templateForm.name || !templateForm.html || !templateForm.css}
          >
            Create Template
          </Button>
        </div>
      </Modal>
      
      {/* Edit Template Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Template: ${templateToEdit?.name}`}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <Input
              id="edit-name"
              name="name"
              value={templateForm.name}
              onChange={handleFormChange}
              placeholder="Enter template name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <Input
              id="edit-description"
              name="description"
              value={templateForm.description}
              onChange={handleFormChange}
              placeholder="Enter template description"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-html" className="block text-sm font-medium text-gray-700 mb-1">
                HTML Template
              </label>
              <textarea
                id="edit-html"
                name="html"
                value={templateForm.html}
                onChange={handleFormChange}
                rows={10}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="Enter HTML template code"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-css" className="block text-sm font-medium text-gray-700 mb-1">
                CSS Styles
              </label>
              <textarea
                id="edit-css"
                name="css"
                value={templateForm.css}
                onChange={handleFormChange}
                rows={10}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="Enter CSS styles"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateTemplate}
            disabled={!templateForm.name || !templateForm.html || !templateForm.css}
          >
            Update Template
          </Button>
        </div>
      </Modal>
      
      {/* Preview Template Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={`Preview: ${templateToPreview?.name}`}
        size="xl"
      >
        {templateToPreview && (
          <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-base font-medium text-gray-900">Invoice Preview</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/preview-template/${templateToPreview.id}`, '_blank')}
              >
                Open in New Tab
              </Button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto">
              <div 
                className="invoice-preview" 
                dangerouslySetInnerHTML={{ 
                  __html: `
                    <style>${templateToPreview.css}</style>
                    ${templateToPreview.html
                      .replace(/{company_name}/g, 'Your Company Name')
                      .replace(/{invoice_number}/g, 'INV-2023-001')
                      .replace(/{invoice_date}/g, new Date().toLocaleDateString())
                      .replace(/{due_date}/g, new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString())
                      .replace(/{customer_name}/g, 'Sample Customer')
                      .replace(/{customer_address}/g, '123 Customer St, City, Country')
                      .replace(/{customer_email}/g, 'customer@example.com')
                      .replace(/{customer_phone}/g, '+1 234 567 890')
                      .replace(/{subtotal}/g, '$1,000.00')
                      .replace(/{tax}/g, '$100.00')
                      .replace(/{total}/g, '$1,100.00')
                    }
                  `
                }}
              />
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setIsPreviewModalOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Template"
      >
        <div className="p-4">
          <p className="text-gray-700">
            Are you sure you want to delete the template "{templateToDelete?.name}"? This action cannot be undone.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
          >
            Delete Template
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// Default template HTML
const getDefaultTemplateHTML = () => {
  return `
<div class="invoice-container">
  <div class="invoice-header">
    <div class="logo-container">
      <img src="{company_logo}" alt="{company_name}" class="logo" />
    </div>
    <div class="invoice-title">
      <h1>INVOICE</h1>
      <div class="invoice-number">#{invoice_number}</div>
    </div>
  </div>
  
  <div class="invoice-info">
    <div class="company-info">
      <h2>{company_name}</h2>
      <p>{company_address}</p>
      <p>{company_email}</p>
      <p>{company_phone}</p>
    </div>
    <div class="customer-info">
      <h3>Bill To:</h3>
      <h2>{customer_name}</h2>
      <p>{customer_address}</p>
      <p>{customer_email}</p>
      <p>{customer_phone}</p>
    </div>
    <div class="dates">
      <div class="date-row">
        <span class="date-label">Invoice Date:</span>
        <span class="date-value">{invoice_date}</span>
      </div>
      <div class="date-row">
        <span class="date-label">Due Date:</span>
        <span class="date-value">{due_date}</span>
      </div>
    </div>
  </div>
  
  <div class="invoice-items">
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoice_items}
      </tbody>
    </table>
  </div>
  
  <div class="invoice-summary">
    <div class="summary-row">
      <span class="summary-label">Subtotal:</span>
      <span class="summary-value">{subtotal}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Tax ({tax_rate}%):</span>
      <span class="summary-value">{tax}</span>
    </div>
    <div class="summary-row total">
      <span class="summary-label">Total:</span>
      <span class="summary-value">{total}</span>
    </div>
  </div>
  
  <div class="invoice-footer">
    <div class="payment-info">
      <h3>Payment Information</h3>
      <p>Account Name: {account_name}</p>
      <p>Account Number: {account_number}</p>
      <p>Bank: {bank_name}</p>
    </div>
    <div class="notes">
      <h3>Notes</h3>
      <p>{notes}</p>
    </div>
  </div>
  
  <div class="invoice-thank-you">
    <p>Thank you for your business!</p>
  </div>
</div>
  `;
};

// Default template CSS
const getDefaultTemplateCSS = () => {
  return `
.invoice-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #fff;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.logo-container {
  flex: 1;
}

.logo {
  max-height: 80px;
  max-width: 200px;
}

.invoice-title {
  text-align: right;
  flex: 1;
}

.invoice-title h1 {
  color: #2563eb;
  margin: 0;
  font-size: 28px;
}

.invoice-number {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}

.invoice-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.company-info, .customer-info, .dates {
  flex: 1;
}

.company-info h2, .customer-info h2 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.company-info p, .customer-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.customer-info h3, .dates h3 {
  font-size: 14px;
  color: #999;
  margin: 0 0 10px 0;
  text-transform: uppercase;
}

.date-row {
  margin: 5px 0;
  font-size: 14px;
}

.date-label {
  color: #999;
  margin-right: 10px;
}

.invoice-items {
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f3f4f6;
  text-align: left;
  padding: 10px;
  font-size: 14px;
  border-bottom: 2px solid #e5e7eb;
}

td {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.invoice-summary {
  margin-left: auto;
  width: 300px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
}

.summary-row.total {
  font-weight: bold;
  font-size: 16px;
  border-top: 2px solid #e5e7eb;
  padding-top: 15px;
}

.invoice-footer {
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.payment-info, .notes {
  flex: 1;
}

.payment-info h3, .notes h3 {
  font-size: 16px;
  margin: 0 0 10px 0;
  color: #666;
}

.payment-info p, .notes p {
  font-size: 14px;
  margin: 5px 0;
  color: #666;
}

.invoice-thank-you {
  text-align: center;
  margin-top: 50px;
  font-size: 14px;
  color: #666;
}
  `;
};

// Modern template HTML
const getModernTemplateHTML = () => {
  return `
<div class="invoice-container">
  <div class="invoice-header">
    <div class="company-branding">
      <img src="{company_logo}" alt="{company_name}" class="logo" />
      <div class="company-name">{company_name}</div>
    </div>
    <div class="invoice-label">
      <div class="label">INVOICE</div>
      <div class="invoice-number">#{invoice_number}</div>
    </div>
  </div>
  
  <div class="invoice-addresses">
    <div class="address-block from-address">
      <div class="address-label">FROM</div>
      <div class="address-content">
        <div class="name">{company_name}</div>
        <div class="address">{company_address}</div>
        <div class="contact">{company_email}</div>
        <div class="contact">{company_phone}</div>
      </div>
    </div>
    
    <div class="address-block to-address">
      <div class="address-label">TO</div>
      <div class="address-content">
        <div class="name">{customer_name}</div>
        <div class="address">{customer_address}</div>
        <div class="contact">{customer_email}</div>
        <div class="contact">{customer_phone}</div>
      </div>
    </div>
    
    <div class="address-block invoice-details">
      <div class="address-label">DETAILS</div>
      <div class="address-content">
        <div class="detail-row">
          <span class="detail-label">Invoice Date:</span>
          <span class="detail-value">{invoice_date}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Due Date:</span>
          <span class="detail-value">{due_date}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="detail-value status-badge">{invoice_status}</span>
        </div>
      </div>
    </div>
  </div>
  
  <div class="invoice-items">
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoice_items}
      </tbody>
    </table>
  </div>
  
  <div class="invoice-summary-container">
    <div class="invoice-summary">
      <div class="summary-row">
        <span class="summary-label">Subtotal:</span>
        <span class="summary-value">{subtotal}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Tax ({tax_rate}%):</span>
        <span class="summary-value">{tax}</span>
      </div>
      <div class="summary-row total">
        <span class="summary-label">Total:</span>
        <span class="summary-value">{total}</span>
      </div>
    </div>
  </div>
  
  <div class="invoice-footer">
    <div class="payment-info">
      <h3>Payment Information</h3>
      <p>Account Name: {account_name}</p>
      <p>Account Number: {account_number}</p>
      <p>Bank: {bank_name}</p>
    </div>
    <div class="notes">
      <h3>Notes</h3>
      <p>{notes}</p>
    </div>
  </div>
  
  <div class="invoice-thank-you">
    <p>Thank you for your business!</p>
  </div>
</div>
  `;
};

// Modern template CSS
const getModernTemplateCSS = () => {
  return `
.invoice-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.company-branding {
  display: flex;
  align-items: center;
}

.logo {
  max-height: 60px;
  max-width: 60px;
  margin-right: 15px;
}

.company-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.invoice-label {
  text-align: right;
}

.label {
  font-size: 28px;
  font-weight: 700;
  color: #6366f1;
  letter-spacing: 2px;
}

.invoice-number {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}

.invoice-addresses {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.address-block {
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
}

.address-label {
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.address-content {
  font-size: 14px;
  line-height: 1.5;
}

.name {
  font-weight: 600;
  margin-bottom: 5px;
}

.address, .contact {
  color: #666;
}

.detail-row {
  margin-bottom: 5px;
}

.detail-label {
  color: #666;
  margin-right: 5px;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  background-color: #10b981;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.invoice-items {
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f9fafb;
  text-align: left;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #4b5563;
}

.invoice-summary-container {
  display: flex;
  justify-content: flex-end;
}

.invoice-summary {
  width: 300px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
}

.summary-row.total {
  font-weight: 600;
  font-size: 16px;
  border-top: 2px solid #e5e7eb;
  padding-top: 15px;
  color: #6366f1;
}

.invoice-footer {
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e5e7eb;
  padding-top: 30px;
  flex-wrap: wrap;
}

.payment-info, .notes {
  flex: 1;
  min-width: 250px;
  margin-bottom: 20px;
}

.payment-info h3, .notes h3 {
  font-size: 16px;
  margin: 0 0 15px 0;
  color: #374151;
  font-weight: 600;
}

.payment-info p, .notes p {
  font-size: 14px;
  margin: 5px 0;
  color: #4b5563;
}

.invoice-thank-you {
  text-align: center;
  margin-top: 50px;
  font-size: 14px;
  color: #6366f1;
  font-weight: 500;
}
  `;
};

// Minimal template HTML
const getMinimalTemplateHTML = () => {
  return `
<div class="invoice-container">
  <div class="invoice-header">
    <div class="invoice-title">INVOICE</div>
  </div>
  
  <div class="invoice-info">
    <div class="info-block">
      <div class="info-label">From</div>
      <div class="company-name">{company_name}</div>
      <div class="info-value">{company_address}</div>
      <div class="info-value">{company_email}</div>
      <div class="info-value">{company_phone}</div>
    </div>
    
    <div class="info-block">
      <div class="info-label">To</div>
      <div class="customer-name">{customer_name}</div>
      <div class="info-value">{customer_address}</div>
      <div class="info-value">{customer_email}</div>
      <div class="info-value">{customer_phone}</div>
    </div>
    
    <div class="info-block">
      <div class="info-label">Invoice Details</div>
      <div class="info-row">
        <span class="info-key">Number:</span>
        <span class="info-value">{invoice_number}</span>
      </div>
      <div class="info-row">
        <span class="info-key">Date:</span>
        <span class="info-value">{invoice_date}</span>
      </div>
      <div class="info-row">
        <span class="info-key">Due Date:</span>
        <span class="info-value">{due_date}</span>
      </div>
    </div>
  </div>
  
  <div class="invoice-items">
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoice_items}
      </tbody>
    </table>
  </div>
  
  <div class="invoice-summary">
    <div class="summary-row">
      <span class="summary-label">Subtotal</span>
      <span class="summary-value">{subtotal}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Tax ({tax_rate}%)</span>
      <span class="summary-value">{tax}</span>
    </div>
    <div class="summary-row total">
      <span class="summary-label">Total</span>
      <span class="summary-value">{total}</span>
    </div>
  </div>
  
  <div class="invoice-footer">
    <div class="footer-block">
      <div class="footer-label">Payment Information</div>
      <div class="footer-content">
        <div>Account Name: {account_name}</div>
        <div>Account Number: {account_number}</div>
        <div>Bank: {bank_name}</div>
      </div>
    </div>
    
    <div class="footer-block">
      <div class="footer-label">Notes</div>
      <div class="footer-content">{notes}</div>
    </div>
  </div>
  
  <div class="invoice-thank-you">
    Thank you for your business
  </div>
</div>
  `;
};

// Minimal template CSS
const getMinimalTemplateCSS = () => {
  return `
.invoice-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background-color: #fff;
}

.invoice-header {
  margin-bottom: 40px;
  text-align: center;
}

.invoice-title {
  font-size: 32px;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #000;
}

.invoice-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.info-block {
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
}

.info-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  color: #999;
}

.company-name, .customer-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.info-value {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.info-row {
  margin-bottom: 5px;
}

.info-key {
  color: #999;
  margin-right: 5px;
}

.invoice-items {
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f8f8f8;
  text-align: left;
  padding: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
  border-bottom: 1px solid #eee;
}

td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
}

.invoice-summary {
  margin-left: auto;
  width: 300px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
}

.summary-row.total {
  font-weight: 500;
  font-size: 16px;
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 5px;
}

.invoice-footer {
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding-top: 30px;
  flex-wrap: wrap;
}

.footer-block {
  flex: 1;
  min-width: 250px;
  margin-bottom: 20px;
}

.footer-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  color: #999;
}

.footer-content {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.invoice-thank-you {
  text-align: center;
  margin-top: 50px;
  font-size: 14px;
  color: #999;
  font-style: italic;
}
  `;
};

export default InvoiceTemplateManager;