import React, { useState, useEffect } from 'react';
import FormTree from './components/FormTree';
import AttributePanel from './components/AttributePanel';
import PageEditor from './components/PageEditor'; // New component for center panel
import { 
  getForm, 
  getAllForms, 
  updateForm, 
  updatePage, 
  updateComponent,
  createPage,
  deletePage,
  createComponent,
  createNestedComponent,
  deleteComponent,
  reorderPages,
  reorderComponents
} from './services/api';
import './App.css';

function App() {
  const [currentForm, setCurrentForm] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentPage, setCurrentPage] = useState(null); // Track which page is being edited
  const [error, setError] = useState(null);

  const fetchAndSetForm = async (formId) => {
    try {
      const formData = await getForm(formId);
      setCurrentForm(formData);
      setError(null);
      // Auto-select first page when form loads
      if (formData && formData.pages && formData.pages.length > 0) {
        setCurrentPage(formData.pages[0]);
        setSelectedNode({ ...formData.pages[0], nodeType: 'page' });
      }
    } catch (err) {
      setError(`Failed to fetch form ID ${formId}: ${err.message}`);
      console.error(`Failed to fetch form ID ${formId}:`, err);
      setCurrentForm(null);
    }
  };

  useEffect(() => {
    const loadInitialForm = async () => {
      try {
        const forms = await getAllForms();
        if (forms && forms.length > 0) {
          await fetchAndSetForm(forms[0].id);
        } else {
          setError('No forms available to display.');
          console.warn('No forms found in the backend.');
        }
      } catch (err) {
        setError(`Failed to fetch initial list of forms: ${err.message}`);
        console.error('Failed to fetch initial list of forms:', err);
      }
    };
    loadInitialForm();
  }, []);

  const handleNodeSelect = (nodeData, nodeType) => {
    setSelectedNode({ ...nodeData, nodeType });
    
    // Update current page when a page or its component is selected
    if (nodeType === 'page') {
      setCurrentPage(nodeData);
    } else if (nodeType === 'component' && currentForm) {
      // Find the page that contains this component
      const containingPage = currentForm.pages.find(page => 
        page.components.some(comp => comp.id === nodeData.id || 
          comp.childComponents?.some(child => child.id === nodeData.id)
        )
      );
      if (containingPage) {
        setCurrentPage(containingPage);
      }
    }
    
    console.log(`App: Selected ${nodeType} - ID: ${nodeData.id}`);
  };

  const handleNodeUpdate = async (updatedNodeData) => {
    if (!selectedNode || !currentForm) return;

    const { nodeType, id } = selectedNode;
    let success = false;

    try {
      switch (nodeType) {
        case 'form':
          await updateForm(id, updatedNodeData);
          success = true;
          break;
        case 'page':
          await updatePage(id, updatedNodeData);
          success = true;
          break;
        case 'component':
          await updateComponent(id, updatedNodeData);
          success = true;
          break;
        default:
          console.error("Unknown node type for update:", nodeType);
          return;
      }
      if (success) {
        console.log(`${nodeType} with ID ${id} updated successfully.`);
        await fetchAndSetForm(currentForm.id);
      }
    } catch (err) {
      setError(`Failed to update ${nodeType} ID ${id}: ${err.message}`);
      console.error(`Failed to update ${nodeType} ID ${id}:`, err);
    }
  };

  // ===== NEW: CREATE OPERATIONS =====

  const handleCreatePage = async (formId, pageData) => {
    try {
      const newPage = await createPage(formId, pageData);
      console.log('Page created successfully:', newPage);
      await fetchAndSetForm(currentForm.id);
      // Auto-select the newly created page
      setSelectedNode({ ...newPage, nodeType: 'page' });
      setCurrentPage(newPage);
    } catch (err) {
      console.error('Failed to create page:', err);
      throw err;
    }
  };

  const handleCreateComponent = async (containerId, componentData, type = 'page') => {
    try {
      let newComponent;
      
      if (type === 'nested' || type === 'field') {
        // Creating a nested component under a parent component (both sub-components and fields)
        newComponent = await createNestedComponent(containerId, componentData);
      } else {
        // Creating a component in a page
        const defaultComponentData = componentData || {
          componentType: 'TEXT_INPUT',
          label: 'New Component',
          attributes: '{}'
        };
        newComponent = await createComponent(containerId, defaultComponentData);
      }
      
      console.log('Component created successfully:', newComponent);
      await fetchAndSetForm(currentForm.id);
      
      // Auto-select the newly created component
      setSelectedNode({ ...newComponent, nodeType: 'component' });
    } catch (err) {
      console.error('Failed to create component:', err);
      throw err;
    }
  };

  // ===== NEW: DELETE OPERATIONS =====

  const handleDeletePage = async (pageId) => {
    try {
      await deletePage(pageId);
      console.log('Page deleted successfully');
      await fetchAndSetForm(currentForm.id);
      
      // Clear selection if deleted page was selected
      if (selectedNode && selectedNode.nodeType === 'page' && selectedNode.id === pageId) {
        setSelectedNode(null);
        setCurrentPage(null);
      }
    } catch (err) {
      console.error('Failed to delete page:', err);
      throw err;
    }
  };

  const handleDeleteComponent = async (componentId) => {
    try {
      await deleteComponent(componentId);
      console.log('Component deleted successfully');
      await fetchAndSetForm(currentForm.id);
      
      // Clear selection if deleted component was selected
      if (selectedNode && selectedNode.nodeType === 'component' && selectedNode.id === componentId) {
        setSelectedNode(null);
      }
    } catch (err) {
      console.error('Failed to delete component:', err);
      throw err;
    }
  };

  // ===== NEW: MOVE/REORDER OPERATIONS =====

  const handleMoveComponent = async (itemId, itemType, direction, parentItems = []) => {
    if (!currentForm) return;

    try {
      if (itemType === 'page') {
        // Reordering pages
        const pages = currentForm.pages;
        const currentIndex = pages.findIndex(p => p.id === itemId);
        
        if (direction === 'up' && currentIndex > 0) {
          const newOrder = [...pages];
          [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
          const pageIds = newOrder.map(p => p.id);
          await reorderPages(currentForm.id, pageIds);
        } else if (direction === 'down' && currentIndex < pages.length - 1) {
          const newOrder = [...pages];
          [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
          const pageIds = newOrder.map(p => p.id);
          await reorderPages(currentForm.id, pageIds);
        }
      } else if (itemType === 'component') {
        // Reordering components
        const currentIndex = parentItems.findIndex(c => c.id === itemId);
        
        if (direction === 'up' && currentIndex > 0) {
          const newOrder = [...parentItems];
          [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
          const componentIds = newOrder.map(c => c.id);
          
          // Determine if we're reordering within a page or within a parent component
          const component = parentItems[0];
          if (component && component.page) {
            await reorderComponents(component.page.id, 'page', componentIds);
          } else {
            // This would need additional logic to determine the parent component ID
            console.warn('Component reordering for nested components not fully implemented');
          }
        } else if (direction === 'down' && currentIndex < parentItems.length - 1) {
          const newOrder = [...parentItems];
          [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
          const componentIds = newOrder.map(c => c.id);
          
          const component = parentItems[0];
          if (component && component.page) {
            await reorderComponents(component.page.id, 'page', componentIds);
          }
        }
      }
      
      console.log(`${itemType} moved ${direction} successfully`);
      await fetchAndSetForm(currentForm.id);
    } catch (err) {
      console.error(`Failed to move ${itemType}:`, err);
      setError(`Failed to move ${itemType}: ${err.message}`);
    }
  };

  if (error && !currentForm) {
    return <div className="App-error">Critical Error: {error}. Please ensure the backend is running and accessible.</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Form Builder</h1>
      </header>
      <div className="App-content-wrapper">
        {/* LEFT PANEL - Form Structure Tree */}
        <aside className="App-sidebar">
          <h4>Form Structure</h4>
          {currentForm ? (
            <FormTree
              form={currentForm}
              onSelectNode={handleNodeSelect}
              selectedNodeId={selectedNode ? selectedNode.id : null}
              selectedNodeType={selectedNode ? selectedNode.nodeType : null}
              onCreatePage={handleCreatePage}
              onDeletePage={handleDeletePage}
              onCreateComponent={handleCreateComponent}
              onDeleteComponent={handleDeleteComponent}
              onMoveComponent={handleMoveComponent}
            />
          ) : (
            <div className="App-loading">{error ? `Error: ${error}` : 'Loading form data...'}</div>
          )}
        </aside>
        
        {/* CENTER PANEL - Page/Component Editor */}
        <main className="App-main-content">
          {currentPage ? (
            <PageEditor
              page={currentPage}
              selectedNode={selectedNode}
              onSelectNode={handleNodeSelect}
              onCreateComponent={handleCreateComponent}
              onDeleteComponent={handleDeleteComponent}
              onMoveComponent={handleMoveComponent}
            />
          ) : (
            <div className="App-loading">Select a page to edit</div>
          )}
        </main>
        
        {/* RIGHT PANEL - Attributes Editor */}
        <aside className="App-attribute-panel">
          {selectedNode ? (
            <AttributePanel
              key={selectedNode.id + selectedNode.nodeType}
              node={selectedNode}
              onSave={handleNodeUpdate}
            />
          ) : (
            <div className="panel-placeholder">Select a node to view/edit its attributes.</div>
          )}
        </aside>
      </div>
      {selectedNode && (
        <footer className="App-footer">
          Selected: {selectedNode.nodeType} - ID: {selectedNode.id} - Name/Label: {selectedNode.name || selectedNode.label || ''}
        </footer>
      )}
    </div>
  );
}

export default App;
