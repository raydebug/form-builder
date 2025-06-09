import React, { useState, useEffect } from 'react';
import ComponentNode from './ComponentNode';
import './FormTree.css';

const FormTree = ({ form, onSelectNode, selectedNodeId, selectedNodeType, onCreatePage, onDeletePage, onCreateComponent, onDeleteComponent, onMoveComponent }) => {
  const [expandedPages, setExpandedPages] = useState({});
  const [showAddPageForm, setShowAddPageForm] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  // Helper function to get component icon based on type
  const getComponentIcon = (componentType) => {
    const iconMap = {
      // Container components
      'PANEL': '📦',
      'CONTAINER': '📦', 
      'FIELDSET': '🗂️',
      'GROUP': '📁',
      'SECTION': '📋',
      'CARD': '🃏',
      'TAB_PANEL': '📑',
      'ACCORDION': '🪗',
      
      // Input components
      'TEXT_INPUT': '📝',
      'EMAIL_INPUT': '📧',
      'PASSWORD_INPUT': '🔒',
      'TEXT_AREA': '📄',
      'NUMBER_INPUT': '🔢',
      'DATE_INPUT': '📅',
      'TIME_INPUT': '⏰',
      'FILE_INPUT': '📎',
      'HIDDEN_INPUT': '👁️‍🗨️',
      
      // Selection components
      'CHECKBOX': '☑️',
      'RADIO': '🔘',
      'SELECT': '📋',
      
      // Action components
      'BUTTON': '🔲',
      'SUBMIT_BUTTON': '✅'
    };
    
    return iconMap[componentType] || '⚬';
  };

  // Pages collapsed by default - no auto-expansion
  useEffect(() => {
    if (form && form.pages && form.pages.length > 0) {
      // All pages start collapsed by default
      setExpandedPages({});
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
        className={`tree-item form-node ${isFormSelected ? 'selected' : ''}`}
        onClick={handleFormSelect}
      >
        <div className="tree-item-content">
          <span className="tree-checkbox">{isFormSelected ? '☑' : '☐'}</span>
          <span className="tree-icon">📋</span>
          <span className="tree-text">{form.name}</span>
          <div className="tree-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="tree-action-btn"
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
              className={`tree-item page-node level-1 ${isPageSelected ? 'selected' : ''}`}
              onClick={(e) => handlePageSelect(page, e)}
            >
              <div className="tree-item-content">
                <span className="tree-indent"></span>
                <button
                  className="tree-expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePageExpansion(page.id);
                  }}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
                <span className="tree-checkbox">{isPageSelected ? '☑' : '☐'}</span>
                <span className="tree-icon">📄</span>
                <span className="tree-text">{page.name}</span>
                <div className="tree-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="tree-action-btn"
                    onClick={() => onCreateComponent && onCreateComponent(page.id)}
                    title="Add Component"
                  >
                    ➕
                  </button>
                  <button
                    className="tree-action-btn"
                    onClick={() => onMoveComponent && onMoveComponent(page.id, 'page', 'up')}
                    title="Move Up"
                    disabled={pages.indexOf(page) === 0}
                  >
                    ⬆️
                  </button>
                  <button
                    className="tree-action-btn"
                    onClick={() => onMoveComponent && onMoveComponent(page.id, 'page', 'down')}
                    title="Move Down"
                    disabled={pages.indexOf(page) === pages.length - 1}
                  >
                    ⬇️
                  </button>
                  <button
                    className="tree-action-btn"
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
                {components.map(component => (
                  <div
                    key={component.id}
                    className={`tree-item component-node level-2 ${selectedNodeType === 'component' && selectedNodeId === component.id ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(component, 'component');
                    }}
                  >
                    <div className="tree-item-content">
                      <span className="tree-indent"></span>
                      <span className="tree-indent"></span>
                      <span className="tree-checkbox">{selectedNodeType === 'component' && selectedNodeId === component.id ? '☑' : '☐'}</span>
                      <span className="tree-icon">
                        {getComponentIcon(component.componentType)}
                      </span>
                      <span className="tree-text">{component.label}</span>
                    </div>
                    
                    {/* Render child components recursively for tree view */}
                    {component.childComponents && component.childComponents.length > 0 && (
                      <div className="tree-child-components">
                        {component.childComponents.map(child => (
                          <div
                            key={child.id}
                            className={`tree-item component-node level-3 ${selectedNodeType === 'component' && selectedNodeId === child.id ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectNode(child, 'component');
                            }}
                          >
                            <div className="tree-item-content">
                              <span className="tree-indent"></span>
                              <span className="tree-indent"></span>
                              <span className="tree-indent"></span>
                              <span className="tree-checkbox">{selectedNodeType === 'component' && selectedNodeId === child.id ? '☑' : '☐'}</span>
                              <span className="tree-icon">
                                {getComponentIcon(child.componentType)}
                              </span>
                              <span className="tree-text">{child.label}</span>
                            </div>
                            
                            {/* Recursive rendering for deeper nesting */}
                            {child.childComponents && child.childComponents.length > 0 && (
                              <div className="tree-child-components">
                                {child.childComponents.map(grandchild => (
                                  <div
                                    key={grandchild.id}
                                    className={`tree-item component-node level-4 ${selectedNodeType === 'component' && selectedNodeId === grandchild.id ? 'selected' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSelectNode(grandchild, 'component');
                                    }}
                                  >
                                    <div className="tree-item-content">
                                      <span className="tree-indent"></span>
                                      <span className="tree-indent"></span>
                                      <span className="tree-indent"></span>
                                      <span className="tree-indent"></span>
                                      <span className="tree-checkbox">{selectedNodeType === 'component' && selectedNodeId === grandchild.id ? '☑' : '☐'}</span>
                                      <span className="tree-icon">{getComponentIcon(grandchild.componentType)}</span>
                                      <span className="tree-text">{grandchild.label}</span>
                                    </div>
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
                {components.length === 0 && (
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
