import React, { useState, useEffect } from 'react';
import './AttributePanel.css';

const AttributePanel = ({ node, onSave }) => {
  const [editData, setEditData] = useState({});
  const [jsonAttributes, setJsonAttributes] = useState(''); // For component attributes JSON string

  useEffect(() => {
    if (node) {
      // Initialize editData with a copy of node properties
      const { nodeType, children, childComponents, components, pages, ...editableNodeData } = node;
      setEditData(editableNodeData);

      if (node.nodeType === 'component' && node.attributes) {
        try {
          // Pretty print JSON for textarea
          setJsonAttributes(JSON.stringify(JSON.parse(node.attributes), null, 2));
        } catch (e) {
          setJsonAttributes(node.attributes); // Fallback to raw string if not valid JSON
          console.warn("Component attributes are not valid JSON:", node.attributes);
        }
      } else {
        setJsonAttributes('');
      }
    } else {
      setEditData({});
      setJsonAttributes('');
    }
  }, [node]); // Re-initialize when the selected node changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleJsonAttributesChange = (e) => {
    setJsonAttributes(e.target.value);
  };

  const handleSave = () => {
    let dataToSave = { ...editData };
    if (node.nodeType === 'component') {
      try {
        // Try to parse JSON before saving, or save as string if preferred by backend
        JSON.parse(jsonAttributes); // This validates the JSON
        dataToSave.attributes = jsonAttributes;
      } catch (e) {
        // Handle invalid JSON, maybe show an error to the user
        // For now, we'll save the potentially invalid string, or you can prevent saving
        console.error("Attempting to save invalid JSON for component attributes:", jsonAttributes);
        alert("Attributes JSON is invalid. Please correct it before saving.");
        return;
      }
    }
    onSave(dataToSave);
  };

  if (!node) {
    return <div className="attribute-panel-placeholder">Select a node to view/edit its attributes.</div>;
  }

  const renderFormFields = () => (
    <>
      <div className="form-field">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={editData.name || ''} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={editData.description || ''} onChange={handleChange} rows="3"></textarea>
      </div>
    </>
  );

  const renderPageFields = () => (
    <>
      <div className="form-field">
        <label htmlFor="pageNumber">Page Number:</label>
        <input type="number" id="pageNumber" name="pageNumber" value={editData.pageNumber || ''} onChange={handleChange} />
      </div>
      {/* Add other page-specific fields if any */}
    </>
  );

  const renderComponentFields = () => (
    <>
      <div className="form-field">
        <label htmlFor="label">Label:</label>
        <input type="text" id="label" name="label" value={editData.label || ''} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="componentType">Component Type:</label>
        <input type="text" id="componentType" name="componentType" value={editData.componentType || ''} onChange={handleChange} />
        {/* Could be a dropdown if types are predefined */}
      </div>
      <div className="form-field">
        <label htmlFor="attributes">Attributes (JSON):</label>
        <textarea
          id="attributes"
          name="attributes"
          value={jsonAttributes}
          onChange={handleJsonAttributesChange}
          rows="5"
          placeholder='Enter attributes as a valid JSON string e.g., {"placeholder": "Enter text"}'
        />
      </div>
    </>
  );

  return (
    <div className="attribute-panel">
      <h3>Edit Attributes ({node.nodeType})</h3>
      <p>ID: {node.id}</p>
      {node.nodeType === 'form' && renderFormFields()}
      {node.nodeType === 'page' && renderPageFields()}
      {node.nodeType === 'component' && renderComponentFields()}
      <button onClick={handleSave} className="save-button">Save Changes</button>
    </div>
  );
};

export default AttributePanel;
