import React, { useState, useEffect } from 'react';
import ComponentNode from './ComponentNode';
import './FormTree.css';

const FormTree = ({ form, onSelectNode, selectedNodeId, selectedNodeType, onCreatePage, onDeletePage, onCreateComponent, onDeleteComponent, onMoveComponent }) => {
  const [expandedPages, setExpandedPages] = useState({});
  const [showAddPageForm, setShowAddPageForm] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  // Auto-expand first page when form loads
  useEffect(() => {
    if (form && form.pages && form.pages.length > 0) {
      setExpandedPages(prev => ({
        ...prev,
        [form.pages[0].id]: true
      }));
    }
  }, [form]);

  if (!form) {
    return <div className="form-tree-placeholder">No form data available.</div>;
  }

  const handleFormSelect = (e) => {
    e.stopPropagation();
    if (onSelectNode) {
      onSelectNode(form, 'form');
    }
  };

  const handlePageSelect = (page, e) => {
    e.stopPropagation();
    if (onSelectNode) {
      onSelectNode(page, 'page');
    }
  };

  const togglePageExpansion = (pageId) => {
    setExpandedPages(prev => ({
      ...prev,
      [pageId]: !prev[pageId]
    }));
  };

  // Create page handlers
  const handleShowAddPage = (e) => {
    e.stopPropagation();
    setShowAddPageForm(true);
    setNewPageName('');
  };

  const handleCancelAddPage = () => {
    setShowAddPageForm(false);
    setNewPageName('');
  };

  const handleSubmitAddPage = async (e) => {
    e.preventDefault();
    if (newPageName && onCreatePage) {
      try {
        await onCreatePage(form.id, { name: newPageName });
        setShowAddPageForm(false);
        setNewPageName('');
      } catch (error) {
        console.error('Error creating page:', error);
        alert('Failed to create page: ' + error.message);
      }
    }
  };

  // Delete page handler
  const handleDeletePage = async (pageId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this page? All components will be deleted.')) {
      try {
        await onDeletePage(pageId);
      } catch (error) {
        console.error('Error deleting page:', error);
        alert('Failed to delete page: ' + error.message);
      }
    }
  };

  const isFormSelected = selectedNodeType === 'form' && selectedNodeId === form.id;
  const pages = form.pages || [];

  return (
    <div className="form-tree">
      {/* Form Node */}
      <div
        className={`form-node ${isFormSelected ? 'selected-node' : ''}`}
        onClick={handleFormSelect}
      >
        <div className="node-content">
          <span className="node-text">📋 {form.name}</span>
          <div className="node-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="action-btn add-btn"
              onClick={handleShowAddPage}
              title="Add Page"
            >
              ➕
            </button>
          </div>
        </div>
      </div>

      {/* Add Page Form */}
      {showAddPageForm && (
        <form className="add-form" onSubmit={handleSubmitAddPage}>
          <div className="add-form-content">
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="Page name"
              required
              autoFocus
            />
            <div className="add-form-buttons">
              <button type="submit" className="btn-primary">Add</button>
              <button type="button" className="btn-secondary" onClick={handleCancelAddPage}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* Pages */}
      {pages.map(page => {
        const isPageSelected = selectedNodeType === 'page' && selectedNodeId === page.id;
        const isExpanded = expandedPages[page.id];
        const components = page.components || [];

        return (
          <div key={page.id} className="page-container">
            {/* Page Node */}
            <div
              className={`page-node ${isPageSelected ? 'selected-node' : ''}`}
              onClick={(e) => handlePageSelect(page, e)}
            >
              <div className="node-content">
                <button
                  className="expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePageExpansion(page.id);
                  }}
                >
                  {isExpanded ? '📂' : '📁'}
                </button>
                <span className="node-text">📄 {page.name}</span>
                <div className="node-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="action-btn add-btn"
                    onClick={() => onCreateComponent && onCreateComponent(page.id)}
                    title="Add Component"
                  >
                    ➕
                  </button>
                  <button
                    className="action-btn move-up-btn"
                    onClick={() => onMoveComponent && onMoveComponent(page.id, 'page', 'up')}
                    title="Move Up"
                    disabled={pages.indexOf(page) === 0}
                  >
                    ⬆️
                  </button>
                  <button
                    className="action-btn move-down-btn"
                    onClick={() => onMoveComponent && onMoveComponent(page.id, 'page', 'down')}
                    title="Move Down"
                    disabled={pages.indexOf(page) === pages.length - 1}
                  >
                    ⬇️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={(e) => handleDeletePage(page.id, e)}
                    title="Delete Page"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            {/* Page Components - Tree View (Read-Only) */}
            {isExpanded && (
              <div className="page-components">
                {components.filter(component => !component.parentComponent).map(component => (
                  <div
                    key={component.id}
                    className={`tree-component-node ${selectedNodeType === 'component' && selectedNodeId === component.id ? 'selected-node' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(component, 'component');
                    }}
                    style={{ marginLeft: `${20}px` }}
                  >
                    <span className="component-icon">
                      {['PANEL', 'CONTAINER', 'FIELDSET', 'GROUP', 'SECTION'].includes(component.componentType) ? '📦' : '⚬'}
                    </span>
                    <span className="component-label">{component.label}</span>
                    <span className="component-type-badge">[{component.componentType}]</span>
                    
                    {/* Render child components recursively for tree view */}
                    {component.childComponents && component.childComponents.length > 0 && (
                      <div className="tree-child-components" style={{ marginLeft: '20px' }}>
                        {component.childComponents.map(child => (
                          <div
                            key={child.id}
                            className={`tree-component-node ${selectedNodeType === 'component' && selectedNodeId === child.id ? 'selected-node' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectNode(child, 'component');
                            }}
                            style={{ marginLeft: `${20}px` }}
                          >
                            <span className="component-icon">
                              {['PANEL', 'CONTAINER', 'FIELDSET', 'GROUP', 'SECTION'].includes(child.componentType) ? '📦' : '⚬'}
                            </span>
                            <span className="component-label">{child.label}</span>
                            <span className="component-type-badge">[{child.componentType}]</span>
                            
                            {/* Recursive rendering for deeper nesting */}
                            {child.childComponents && child.childComponents.length > 0 && (
                              <div className="tree-child-components" style={{ marginLeft: '20px' }}>
                                {child.childComponents.map(grandchild => (
                                  <div
                                    key={grandchild.id}
                                    className={`tree-component-node ${selectedNodeType === 'component' && selectedNodeId === grandchild.id ? 'selected-node' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSelectNode(grandchild, 'component');
                                    }}
                                    style={{ marginLeft: `${20}px` }}
                                  >
                                    <span className="component-icon">⚬</span>
                                    <span className="component-label">{grandchild.label}</span>
                                    <span className="component-type-badge">[{grandchild.componentType}]</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {components.filter(component => !component.parentComponent).length === 0 && (
                  <div className="no-components-message">
                    <span>No components yet</span>
                    <button
                      className="add-first-component-btn"
                      onClick={() => onCreateComponent && onCreateComponent(page.id)}
                    >
                      Add First Component
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {pages.length === 0 && (
        <div className="no-pages-message">
          <span>No pages yet</span>
          <button
            className="add-first-page-btn"
            onClick={handleShowAddPage}
          >
            Add First Page
          </button>
        </div>
      )}
    </div>
  );
};

export default FormTree;
