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

  const handleMoveComponent = async (itemId, itemType, direction, parentInfo = null) => {
    console.log('🔄 Move operation called:', { itemId, itemType, direction, parentInfo });
    if (!currentForm) {
      console.log('❌ No current form available');
      return;
    }

    try {
      if (itemType === 'page') {
        // Reordering pages
        const pages = currentForm.pages;
        const currentIndex = pages.findIndex(p => p.id === itemId);
        
        if (direction === 'up' && currentIndex > 0) {
          console.log('⬆️ Moving page up:', { currentIndex, pageId: itemId });
          const newOrder = [...pages];
          [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
          const pageIds = newOrder.map(p => p.id);
          console.log('📤 Calling reorderPages API with:', pageIds);
          await reorderPages(currentForm.id, pageIds);
        } else if (direction === 'down' && currentIndex < pages.length - 1) {
          console.log('⬇️ Moving page down:', { currentIndex, pageId: itemId });
          const newOrder = [...pages];
          [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
          const pageIds = newOrder.map(p => p.id);
          console.log('📤 Calling reorderPages API with:', pageIds);
          await reorderPages(currentForm.id, pageIds);
        } else {
          console.log('🚫 Page move blocked:', { direction, currentIndex, totalPages: pages.length });
        }
      } else if (itemType === 'component') {
        console.log('🔧 Processing component move operation...');
        
        // Reordering components - need to find the parent context
        if (!parentInfo || !parentInfo.siblingComponents) {
          console.log('🔍 No parentInfo provided, searching for component in form...');
          
          // Find which page this component belongs to
          let parentPageId = null;
          let siblingComponents = [];
          
          // Check if currentForm and pages exist
          if (!currentForm || !currentForm.pages) {
            console.log('❌ No form or pages available');
            throw new Error('No form data available for component reordering');
          }
          
          for (const page of currentForm.pages) {
            const pageComponents = page.components || [];
            console.log(`🔍 Checking page ${page.id} with ${pageComponents.length} components`);
            
            // Check top-level components first
            if (pageComponents.find(c => c.id === itemId)) {
              parentPageId = page.id;
              siblingComponents = pageComponents;
              console.log(`✅ Found component ${itemId} in page ${page.id} at top level`);
              break;
            }
            
            // Also check nested components
            for (const component of pageComponents) {
              if (component.childComponents && component.childComponents.find(c => c.id === itemId)) {
                parentPageId = component.id;
                siblingComponents = component.childComponents;
                console.log(`✅ Found component ${itemId} nested in component ${component.id}`);
                break;
              }
            }
            
            if (parentPageId) break;
          }
          
          if (!parentPageId) {
            console.log('❌ Component not found in any page');
            throw new Error(`Component ${itemId} not found in form structure`);
          }
          
          if (!siblingComponents || !Array.isArray(siblingComponents)) {
            console.log('❌ Invalid sibling components array');
            throw new Error('Invalid sibling components structure');
          }
          
          console.log(`📍 Component context: parentPageId=${parentPageId}, siblings=${siblingComponents.length}`);
          const currentIndex = siblingComponents.findIndex(c => c.id === itemId);
          
          if (currentIndex === -1) {
            console.log('❌ Component not found in sibling list');
            throw new Error(`Component ${itemId} not found in sibling components`);
          }
          
          console.log(`📍 Current index: ${currentIndex} of ${siblingComponents.length}`);
          
          if (direction === 'up' && currentIndex > 0) {
            console.log('⬆️ Moving component up');
            const newOrder = [...siblingComponents];
            [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
            const componentIds = newOrder.map(c => c.id);
            console.log('📤 Calling reorderComponents with:', { parentPageId, componentIds });
            await reorderComponents(parentPageId, 'page', componentIds);
          } else if (direction === 'down' && currentIndex < siblingComponents.length - 1) {
            console.log('⬇️ Moving component down');
            const newOrder = [...siblingComponents];
            [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
            const componentIds = newOrder.map(c => c.id);
            console.log('📤 Calling reorderComponents with:', { parentPageId, componentIds });
            await reorderComponents(parentPageId, 'page', componentIds);
          } else {
            console.log('🚫 Component move blocked:', { direction, currentIndex, totalComponents: siblingComponents.length });
          }
        } else {
          console.log('🔧 Using provided parentInfo:', parentInfo);
          
          // Use provided parent info for nested components  
          const { containerId, containerType, siblingComponents } = parentInfo;
          
          if (!siblingComponents || !Array.isArray(siblingComponents)) {
            console.log('❌ Invalid siblingComponents in parentInfo');
            throw new Error('Invalid siblingComponents provided in parentInfo');
          }
          
          const currentIndex = siblingComponents.findIndex(c => c.id === itemId);
          
          if (currentIndex === -1) {
            console.log('❌ Component not found in provided sibling list');
            throw new Error(`Component ${itemId} not found in provided sibling components`);
          }
          
          if (direction === 'up' && currentIndex > 0) {
            console.log('⬆️ Moving nested component up');
            const newOrder = [...siblingComponents];
            [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
            const componentIds = newOrder.map(c => c.id);
            console.log('📤 Calling reorderComponents with:', { containerId, containerType, componentIds });
            await reorderComponents(containerId, containerType, componentIds);
          } else if (direction === 'down' && currentIndex < siblingComponents.length - 1) {
            console.log('⬇️ Moving nested component down');
            const newOrder = [...siblingComponents];
            [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
            const componentIds = newOrder.map(c => c.id);
            console.log('📤 Calling reorderComponents with:', { containerId, containerType, componentIds });
            await reorderComponents(containerId, containerType, componentIds);
          } else {
            console.log('🚫 Nested component move blocked:', { direction, currentIndex, totalComponents: siblingComponents.length });
          }
        }
      }
      
      console.log(`✅ ${itemType} moved ${direction} successfully`);
      console.log('🔄 Refreshing form data...');
      await fetchAndSetForm(currentForm.id);
    } catch (err) {
      console.error(`❌ Failed to move ${itemType}:`, err);
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
