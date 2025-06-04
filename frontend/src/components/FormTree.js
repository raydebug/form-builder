import React from 'react'; // Removed useState as selection is handled by App
import PageNode from './PageNode';
import './FormTree.css';

const FormTree = ({ form, onSelectNode, selectedNodeId, selectedNodeType }) => {
  // Assuming pages are nested under 'pages'
  const pages = form.pages || [];

  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelectNode) {
      onSelectNode(form, 'form');
    }
  };

  if (!form) {
    return <div>Loading form...</div>;
  }

  const isSelected = selectedNodeType === 'form' && selectedNodeId === form.id;

  return (
    <div
      className={`form-node ${isSelected ? 'selected-node' : ''}`}
      onClick={handleSelect}
    >
      <div className="form-content">
        <h2>{form.name || 'Unnamed Form'} (ID: {form.id})</h2>
        <p>{form.description || ''}</p>
      </div>
      <div className="form-pages">
        {pages.map(page => (
          <PageNode
            key={page.id}
            page={page}
            onSelectNode={onSelectNode}
            selectedNodeId={selectedNodeId}
            selectedNodeType={selectedNodeType}
          />
        ))}
      </div>
    </div>
  );
};

export default FormTree;
