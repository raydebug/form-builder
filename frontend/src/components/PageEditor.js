import React, { useState } from 'react';
import './PageEditor.css';

const PageEditor = ({ page, selectedNode, onSelectNode, onCreateComponent, onDeleteComponent, onMoveComponent }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComponentData, setNewComponentData] = useState({
    componentType: 'TEXT_INPUT',
    label: '',
    attributes: '{}'
  });

  if (!page) {
    return (
      <div className="page-editor">
        <div className="page-editor-placeholder">
          No page selected for editing
        </div>
      </div>
    );
  }

  const handleComponentClick = (component, event) => {
    event.stopPropagation();
    onSelectNode(component, 'component');
  };

  const handlePageClick = () => {
    onSelectNode(page, 'page');
  };

  // Add component handlers
  const handleShowAddComponent = () => {
    setShowAddForm(true);
    setNewComponentData({
      componentType: 'TEXT_INPUT',
      label: '',
      attributes: '{}'
    });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewComponentData({
      componentType: 'TEXT_INPUT',
      label: '',
      attributes: '{}'
    });
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (newComponentData.label && onCreateComponent) {
      try {
        await onCreateComponent(page.id, newComponentData);
        setShowAddForm(false);
        setNewComponentData({
          componentType: 'TEXT_INPUT',
          label: '',
          attributes: '{}'
        });
      } catch (error) {
        console.error('Error creating component:', error);
        alert('Failed to create component: ' + error.message);
      }
    }
  };

  // Delete component handler
  const handleDeleteComponent = async (componentId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this component? All child components will be deleted.')) {
      try {
        await onDeleteComponent(componentId);
      } catch (error) {
        console.error('Error deleting component:', error);
        alert('Failed to delete component: ' + error.message);
      }
    }
  };

  // Move component handlers
  const handleMoveComponentUp = (componentId, components, e) => {
    e.stopPropagation();
    if (onMoveComponent) {
      onMoveComponent(componentId, 'component', 'up', components);
    }
  };

  const handleMoveComponentDown = (componentId, components, e) => {
    e.stopPropagation();
    if (onMoveComponent) {
      onMoveComponent(componentId, 'component', 'down', components);
    }
  };

  const renderComponent = (component, depth = 0, parentComponents = []) => {
    const isSelected = selectedNode && selectedNode.id === component.id && selectedNode.nodeType === 'component';
    
    // Define container components (same as in ComponentNode)
    const CONTAINER_COMPONENT_TYPES = [
      'PANEL', 'CONTAINER', 'FIELDSET', 'GROUP', 'SECTION',
      'CARD', 'TAB_PANEL', 'ACCORDION'
    ];
    
    const isContainerComponent = CONTAINER_COMPONENT_TYPES.includes(component.componentType);
    
    return (
      <div
        key={component.id}
        className={`page-editor-component ${isSelected ? 'selected' : ''} ${isContainerComponent ? 'container-type' : 'field-type'}`}
        data-type={component.componentType}
        style={{ marginLeft: `${depth * 20}px` }}
        onClick={(e) => handleComponentClick(component, e)}
      >
        <div className="component-header">
          <span className="component-icon">
            {isContainerComponent ? '📦' : '⚬'}
          </span>
          <span className="component-type">{component.componentType}</span>
          <span className="component-label">{component.label}</span>
          
          <div className="component-actions" onClick={(e) => e.stopPropagation()}>
            {/* Add button - only for container components */}
            {isContainerComponent && (
              <button
                className="action-btn add-btn"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onCreateComponent && onCreateComponent(component.id, null, 'nested'); 
                }}
                title="Add Child Component"
              >
                ➕
              </button>
            )}
            
            <button
              className="action-btn move-up-btn"
              onClick={(e) => handleMoveComponentUp(component.id, parentComponents, e)}
              title="Move Up"
              disabled={parentComponents.findIndex(c => c.id === component.id) === 0}
            >
              ⬆️
            </button>
            <button
              className="action-btn move-down-btn"
              onClick={(e) => handleMoveComponentDown(component.id, parentComponents, e)}
              title="Move Down"
              disabled={parentComponents.findIndex(c => c.id === component.id) === parentComponents.length - 1}
            >
              ⬇️
            </button>
            
            <button
              className="action-btn delete-btn"
              onClick={(e) => handleDeleteComponent(component.id, e)}
              title={`Delete ${isContainerComponent ? 'Container' : 'Field'}`}
            >
              🗑️
            </button>
          </div>
        </div>
        
        {component.attributes && (
          <div className="component-attributes">
            <small>{component.attributes}</small>
          </div>
        )}
        
        {/* Render child components - only for container components */}
        {isContainerComponent && component.childComponents && component.childComponents.length > 0 && (
          <div className="component-children">
            <div className="children-label">Child Components:</div>
            {component.childComponents.map(child => renderComponent(child, depth + 1, component.childComponents))}
          </div>
        )}
        
        {/* Empty state for container components */}
        {isContainerComponent && (!component.childComponents || component.childComponents.length === 0) && (
          <div className="empty-container-state" style={{ marginLeft: `${(depth + 1) * 20}px` }}>
            <span>No child components</span>
            <button
              className="add-first-child-btn"
              onClick={(e) => { 
                e.stopPropagation(); 
                onCreateComponent && onCreateComponent(component.id, null, 'nested'); 
              }}
            >
              Add First Child
            </button>
          </div>
        )}
      </div>
    );
  };

  const isPageSelected = selectedNode && selectedNode.id === page.id && selectedNode.nodeType === 'page';

  return (
    <div className="page-editor">
      <div className="page-editor-header">
        <h3>Page Editor</h3>
        <span className="page-info">{page.name}</span>
        <button
          className="add-component-btn"
          onClick={handleShowAddComponent}
          title="Add Component to Page"
        >
          ➕ Add Component
        </button>
      </div>
      
      <div 
        className={`page-canvas ${isPageSelected ? 'selected' : ''}`}
        onClick={handlePageClick}
      >
        <div className="page-canvas-header">
          <h4>{page.name}</h4>
          <span className="components-count">
            {page.components ? page.components.length : 0} components
          </span>
        </div>

        {/* Add Component Form */}
        {showAddForm && (
          <form className="add-component-form" onSubmit={handleSubmitAdd}>
            <div className="add-form-content">
              <h5>Add New Component</h5>
              <select
                value={newComponentData.componentType}
                onChange={(e) => setNewComponentData(prev => ({ ...prev, componentType: e.target.value }))}
                required
              >
                <option value="TEXT_INPUT">Text Input</option>
                <option value="EMAIL_INPUT">Email Input</option>
                <option value="TEXT_AREA">Text Area</option>
                <option value="CHECKBOX">Checkbox</option>
                <option value="RADIO">Radio Button</option>
                <option value="PANEL">Panel</option>
              </select>
              <input
                type="text"
                value={newComponentData.label}
                onChange={(e) => setNewComponentData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Component label"
                required
                autoFocus
              />
              <textarea
                value={newComponentData.attributes}
                onChange={(e) => setNewComponentData(prev => ({ ...prev, attributes: e.target.value }))}
                placeholder="Component attributes (JSON)"
                rows="3"
              />
              <div className="add-form-buttons">
                <button type="submit" className="btn-primary">Add Component</button>
                <button type="button" className="btn-secondary" onClick={handleCancelAdd}>Cancel</button>
              </div>
            </div>
          </form>
        )}
        
        <div className="page-components">
          {page.components && page.components.length > 0 ? (
            page.components.map(component => renderComponent(component, 0, page.components))
          ) : (
            <div className="no-components">
              <p>No components in this page</p>
              <small>Components will appear here when added</small>
              <button
                className="add-first-component-btn"
                onClick={handleShowAddComponent}
              >
                Add First Component
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="page-editor-footer">
        <small>
          Click on components to select and edit their properties. 
          Use action buttons to add, move, or delete components.
        </small>
      </div>
    </div>
  );
};

export default PageEditor; 