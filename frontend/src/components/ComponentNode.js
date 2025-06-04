import React from 'react'; // Removed useState
import './ComponentNode.css';

const ComponentNode = ({ component, onSelectNode, selectedNodeId, selectedNodeType }) => {
  // Assuming children are nested under a property like 'childComponents'
  const children = component.childComponents || [];

  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelectNode) {
      onSelectNode(component, 'component');
    }
  };

  const isSelected = selectedNodeType === 'component' && selectedNodeId === component.id;

  return (
    <div
      className={`component-node ${isSelected ? 'selected-node' : ''}`}
      onClick={handleSelect}
    >
      <div className="component-content">
        <span>{component.label || component.componentType} (ID: {component.id})</span>
        {/* Display other component properties as needed */}
      </div>
      {children.length > 0 && (
        <div className="component-children">
          {children.map(child => (
            <ComponentNode
              key={child.id}
              component={child}
              onSelectNode={onSelectNode}
              selectedNodeId={selectedNodeId}
              selectedNodeType={selectedNodeType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentNode;
