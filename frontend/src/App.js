import React, { useState, useEffect } from 'react';
import FormTree from './components/FormTree';
import AttributePanel from './components/AttributePanel'; // Will create this
import { getForm, getAllForms, updateForm, updatePage, updateComponent } from './services/api';
import './App.css';

function App() {
  const [currentForm, setCurrentForm] = useState(null); // Renamed for clarity
  const [selectedNode, setSelectedNode] = useState(null);
  const [error, setError] = useState(null);

  const fetchAndSetForm = async (formId) => {
    try {
      const formData = await getForm(formId);
      setCurrentForm(formData);
      setError(null); // Clear previous errors
    } catch (err) {
      setError(`Failed to fetch form ID ${formId}: ${err.message}`);
      console.error(`Failed to fetch form ID ${formId}:`, err);
      setCurrentForm(null); // Clear form data on error
    }
  };

  useEffect(() => {
    const loadInitialForm = async () => {
      try {
        const forms = await getAllForms();
        if (forms && forms.length > 0) {
          // For simplicity, load the first form.
          // In a real app, you might have a form selector or load a default ID.
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
    // Add nodeType to the selectedNode state for easier handling in AttributePanel
    setSelectedNode({ ...nodeData, nodeType });
    console.log(`App: Selected ${nodeType} - ID: ${nodeData.id}`);
  };

  const handleNodeUpdate = async (updatedNodeData) => {
    if (!selectedNode || !currentForm) return;

    const { nodeType, id } = selectedNode; // Get type from the selected node itself
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
        // Refresh the entire form to see changes
        await fetchAndSetForm(currentForm.id);
        // Deselect node after update or keep it selected? For now, keep.
        // setSelectedNode(null);
      }
    } catch (err) {
      setError(`Failed to update ${nodeType} ID ${id}: ${err.message}`);
      console.error(`Failed to update ${nodeType} ID ${id}:`, err);
    }
  };

  if (error && !currentForm) { // Show critical error if no form can be loaded
    return <div className="App-error">Critical Error: {error}. Please ensure the backend is running and accessible.</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Form Builder</h1>
      </header>
      <div className="App-content-wrapper">
        <aside className="App-sidebar">
          {/* Placeholder for a list of forms or other navigation */}
          <h4>Forms</h4>
          {/* Could list forms here and allow switching */}
        </aside>
        <main className="App-main-content">
          {currentForm ? (
            <FormTree
              form={currentForm}
              onSelectNode={handleNodeSelect}
              selectedNodeId={selectedNode ? selectedNode.id : null}
              selectedNodeType={selectedNode ? selectedNode.nodeType : null}
            />
          ) : (
            <div className="App-loading">{error ? `Error: ${error}` : 'Loading form data...'}</div>
          )}
        </main>
        <aside className="App-attribute-panel">
          {selectedNode ? (
            <AttributePanel
              key={selectedNode.id + selectedNode.nodeType} // Force re-render on node change
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
          Selected: {selectedNode.nodeType} - ID: {selectedNode.id} - Name/Label: {selectedNode.name || selectedNode.label || selectedNode.pageNumber || ''}
        </footer>
      )}
    </div>
  );
}

export default App;
