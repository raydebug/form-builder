import React, { useState } from 'react';
import ComponentNode from './ComponentNode';
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

  // Removed renderComponent function - now using ComponentNode directly

  const isPageSelected = selectedNode && selectedNode.id === page.id && selectedNode.nodeType === 'page';

  return (
    <div className="page-editor" data-testid="page-editor">
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
            page.components.map(component => (
              <ComponentNode
                key={component.id}
                component={component}
                onSelectNode={onSelectNode}
                selectedNodeId={selectedNode?.id}
                selectedNodeType={selectedNode?.nodeType}
                onCreateComponent={onCreateComponent}
                onDeleteComponent={onDeleteComponent}
                onMoveComponent={onMoveComponent}
                depth={0}
                siblingComponents={page.components}
              />
            ))
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