import React from 'react'; // Removed useState
import ComponentNode from './ComponentNode';
import './PageNode.css';

const PageNode = ({ page, onSelectNode, selectedNodeId, selectedNodeType }) => {
  // Assuming components are nested under 'components'
  const components = page.components || [];

  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelectNode) {
      onSelectNode(page, 'page');
    }
  };

  const isSelected = selectedNodeType === 'page' && selectedNodeId === page.id;

  return (
    <div
      className={`page-node ${isSelected ? 'selected-node' : ''}`}
      onClick={handleSelect}
    >
      <div className="page-content">
        <span>Page: {page.pageNumber || page.id}</span>
        {/* Display other page properties as needed */}
      </div>
      <div className="page-components">
        {components.map(component => (
          <ComponentNode
            key={component.id}
            component={component}
            onSelectNode={onSelectNode}
            selectedNodeId={selectedNodeId}
            selectedNodeType={selectedNodeType}
          />
        ))}
      </div>
    </div>
  );
};

export default PageNode;
