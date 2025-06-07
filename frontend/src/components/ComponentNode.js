import React, { useState } from 'react';
import './ComponentNode.css';

const ComponentNode = ({ 
  component, 
  onSelectNode, 
  selectedNodeId, 
  selectedNodeType, 
  onCreateComponent, 
  onDeleteComponent, 
  onMoveComponent, 
  depth = 0, 
  siblingComponents = [] 
}) => {
  const [showNestedForm, setShowNestedForm] = useState(false);
  const [newComponentData, setNewComponentData] = useState({
    componentType: 'TEXT_INPUT',
    label: '',
    attributes: '{}'
  });

  // Define which component types can have children (container components)
  const CONTAINER_COMPONENT_TYPES = [
    'PANEL', 
    'CONTAINER', 
    'FIELDSET', 
    'GROUP', 
    'SECTION',
    'CARD',
    'TAB_PANEL',
    'ACCORDION'
  ];

  // Define which component types are fields (leaf nodes)
  const FIELD_COMPONENT_TYPES = [
    'TEXT_INPUT',
    'EMAIL_INPUT', 
    'PASSWORD_INPUT',
    'TEXT_AREA',
    'CHECKBOX',
    'RADIO',
    'SELECT',
    'NUMBER_INPUT',
    'DATE_INPUT',
    'TIME_INPUT',
    'FILE_INPUT',
    'HIDDEN_INPUT',
    'BUTTON',
    'SUBMIT_BUTTON'
  ];

  const isContainerComponent = CONTAINER_COMPONENT_TYPES.includes(component.componentType);

  if (!component) return null;

  const isSelected = selectedNodeType === 'component' && selectedNodeId === component.id;
  const hasChildren = component.childComponents && component.childComponents.length > 0;
  const currentIndex = siblingComponents.findIndex(c => c.id === component.id);
  const canMoveUp = currentIndex > 0;
  const canMoveDown = currentIndex < siblingComponents.length - 1;

  const handleComponentClick = (e) => {
    e.stopPropagation();
    if (onSelectNode) {
      onSelectNode(component, 'component');
    }
  };

  // Nested component creation handlers
  const handleShowNestedForm = (e) => {
    e.stopPropagation();
    if (!isContainerComponent) {
      alert(`${component.componentType} is a field component and cannot contain child components.`);
      return;
    }
    setShowNestedForm(true);
    setNewComponentData({
      componentType: 'TEXT_INPUT',
      label: '',
      attributes: '{}'
    });
  };

  const handleCancelNested = () => {
    setShowNestedForm(false);
    setNewComponentData({
      componentType: 'TEXT_INPUT',
      label: '',
      attributes: '{}'
    });
  };

  const handleSubmitNested = async (e) => {
    e.preventDefault();
    if (newComponentData.label && onCreateComponent) {
      try {
        await onCreateComponent(component.id, newComponentData, 'nested');
        setShowNestedForm(false);
        setNewComponentData({
          componentType: 'TEXT_INPUT',
          label: '',
          attributes: '{}'
        });
      } catch (error) {
        console.error('Error creating nested component:', error);
        alert('Failed to create nested component: ' + error.message);
      }
    }
  };

  // Delete component handler
  const handleDeleteComponent = async (e) => {
    e.stopPropagation();
    const componentTypeLabel = isContainerComponent ? 'container component' : 'field';
    const childrenWarning = hasChildren ? ' All child components will also be deleted.' : '';
    
    if (window.confirm(`Are you sure you want to delete this ${componentTypeLabel}?${childrenWarning}`)) {
      try {
        await onDeleteComponent(component.id);
      } catch (error) {
        console.error('Error deleting component:', error);
        alert('Failed to delete component: ' + error.message);
      }
    }
  };

  // Move component handlers
  const handleMoveUp = (e) => {
    e.stopPropagation();
    if (onMoveComponent) {
      onMoveComponent(component.id, 'component', 'up', siblingComponents);
    }
  };

  const handleMoveDown = (e) => {
    e.stopPropagation();
    if (onMoveComponent) {
      onMoveComponent(component.id, 'component', 'down', siblingComponents);
    }
  };

  return (
    <div className={`component-container depth-${depth}`} style={{ marginLeft: `${depth * 16}px` }}>
      {/* Component Node */}
      <div
        className={`component-node ${isSelected ? 'selected-node' : ''} ${isContainerComponent ? 'container-component' : 'field-component'}`}
        onClick={handleComponentClick}
        data-component-type={component.componentType}
      >
        <div className="node-content">
          <span className="node-icon">
            {isContainerComponent ? '📦' : '⚬'}
          </span>
          <span className="node-label">{component.label}</span>
          <span className="component-type-badge" data-type={component.componentType}>
            {component.componentType}
          </span>
          
          <div className="node-actions" onClick={(e) => e.stopPropagation()}>
            {/* Add button - only for container components */}
            {isContainerComponent && (
              <button
                className="action-btn add-btn"
                onClick={handleShowNestedForm}
                title={`Add Child Component to ${component.label}`}
              >
                ➕
              </button>
            )}
            
            {/* Move buttons - for all components */}
            <button
              className="action-btn move-up-btn"
              onClick={handleMoveUp}
              title="Move Up"
              disabled={!canMoveUp}
            >
              ⬆️
            </button>
            <button
              className="action-btn move-down-btn"
              onClick={handleMoveDown}
              title="Move Down"
              disabled={!canMoveDown}
            >
              ⬇️
            </button>
            
            {/* Delete button - for all components */}
            <button
              className="action-btn delete-btn"
              onClick={handleDeleteComponent}
              title={`Delete ${isContainerComponent ? 'Container' : 'Field'}`}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Nested Component Form - only shown for container components */}
      {showNestedForm && isContainerComponent && (
        <form className="nested-add-form" onSubmit={handleSubmitNested}>
          <div className="nested-form-content">
            <h5>Add Child Component to {component.label}</h5>
            <select
              value={newComponentData.componentType}
              onChange={(e) => setNewComponentData(prev => ({ ...prev, componentType: e.target.value }))}
              required
            >
              <optgroup label="Field Components">
                <option value="TEXT_INPUT">Text Input</option>
                <option value="EMAIL_INPUT">Email Input</option>
                <option value="PASSWORD_INPUT">Password Input</option>
                <option value="TEXT_AREA">Text Area</option>
                <option value="NUMBER_INPUT">Number Input</option>
                <option value="DATE_INPUT">Date Input</option>
                <option value="CHECKBOX">Checkbox</option>
                <option value="RADIO">Radio Button</option>
                <option value="SELECT">Dropdown Select</option>
                <option value="FILE_INPUT">File Upload</option>
                <option value="BUTTON">Button</option>
              </optgroup>
              <optgroup label="Container Components">
                <option value="PANEL">Panel</option>
                <option value="FIELDSET">Fieldset</option>
                <option value="GROUP">Group</option>
                <option value="SECTION">Section</option>
              </optgroup>
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
            <div className="nested-form-buttons">
              <button type="submit" className="btn-primary">Add Component</button>
              <button type="button" className="btn-secondary" onClick={handleCancelNested}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* Child Components - only rendered for container components */}
      {isContainerComponent && hasChildren && (
        <div className="child-components">
          {component.childComponents.map(childComponent => (
            <ComponentNode
              key={childComponent.id}
              component={childComponent}
              onSelectNode={onSelectNode}
              selectedNodeId={selectedNodeId}
              selectedNodeType={selectedNodeType}
              onCreateComponent={onCreateComponent}
              onDeleteComponent={onDeleteComponent}
              onMoveComponent={onMoveComponent}
              depth={depth + 1}
              siblingComponents={component.childComponents}
            />
          ))}
        </div>
      )}

      {/* Empty state for container components */}
      {isContainerComponent && !hasChildren && (
        <div className="empty-container-message" style={{ marginLeft: `${(depth + 1) * 16}px` }}>
          <span>No child components</span>
          <button
            className="add-first-child-btn"
            onClick={handleShowNestedForm}
          >
            Add First Component
          </button>
        </div>
      )}
    </div>
  );
};

export default ComponentNode;
