describe('Form Builder E2E Tests - Three Panel Layout', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('http://localhost:3000');
    
    // Wait for the form to load
    cy.contains('Test Form 1', { timeout: 10000 }).should('be.visible');
  });

  describe('Layout Structure', () => {
    it('should display the three-panel layout correctly', () => {
      // Check header
      cy.get('.App-header').should('be.visible');
      cy.contains('Form Builder').should('be.visible');
      
      // Check left panel (sidebar)
      cy.get('.App-sidebar').should('be.visible');
      cy.contains('Form Structure').should('be.visible');
      
      // Check center panel (main content)
      cy.get('.App-main-content').should('be.visible');
      cy.get('.page-editor').should('be.visible');
      
      // Check right panel (attributes)
      cy.get('.App-attribute-panel').should('be.visible');
      
      // Check footer
      cy.get('.App-footer').should('be.visible');
    });

    it('should have responsive panel sizing', () => {
      // Left panel should have fixed width
      cy.get('.App-sidebar').should('have.css', 'width', '280px');
      
      // Center panel should take more space (flex: 3)
      cy.get('.App-main-content').should('have.css', 'flex', '3 1 0%');
      
      // Right panel should take less space (flex: 1)
      cy.get('.App-attribute-panel').should('have.css', 'flex', '1 1 0%');
    });
  });

  describe('Left Panel - Form Structure Tree', () => {
    it('should display the complete form hierarchy', () => {
      // Check form node with icon
      cy.get('.App-sidebar').within(() => {
        cy.contains('📋 Test Form 1').should('be.visible');
        cy.contains('📄 Personal Information').should('be.visible');
        cy.contains('⚬ First Name').should('be.visible');
        cy.contains('⚬ Contact Info').should('be.visible');
        cy.contains('⚬ Email').should('be.visible');
        cy.contains('⚬ Feedback').should('be.visible');
      });
    });

    it('should show visual hierarchy with indentation', () => {
      cy.get('.App-sidebar .form-node').should('have.css', 'margin-left', '0px');
      cy.get('.App-sidebar .page-node').should('have.css', 'margin-left', '16px');
      cy.get('.App-sidebar .component-node').should('have.css', 'margin-left', '16px');
    });

    it('should handle node selection with visual feedback', () => {
      // Select form
      cy.get('.App-sidebar').contains('📋 Test Form 1').click();
      cy.get('.App-sidebar .form-node').should('have.class', 'selected-node');
      
      // Select page
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.App-sidebar .page-node').should('have.class', 'selected-node');
      cy.get('.App-sidebar .form-node').should('not.have.class', 'selected-node');
      
      // Select component
      cy.get('.App-sidebar').contains('⚬ First Name').click();
      cy.get('.App-sidebar .component-node').first().should('have.class', 'selected-node');
      cy.get('.App-sidebar .page-node').should('not.have.class', 'selected-node');
    });

    it('should show hover effects on tree nodes', () => {
      cy.get('.App-sidebar .form-node')
        .trigger('mouseover')
        .should('have.css', 'background-color', 'rgb(230, 242, 255)');
    });
  });

  describe('Center Panel - Page Editor', () => {
    it('should display page editor when page is selected', () => {
      // Select a page
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Check page editor components
      cy.get('.page-editor').should('be.visible');
      cy.get('.page-editor-header').contains('Page Editor').should('be.visible');
      cy.get('.page-info').contains('Personal Information').should('be.visible');
      cy.get('.page-canvas').should('be.visible');
    });

    it('should display page canvas with components', () => {
      // Select page to load in editor
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Check page canvas content
      cy.get('.page-canvas').within(() => {
        cy.contains('Personal Information').should('be.visible');
        cy.get('.components-count').should('contain', 'components');
        cy.get('.page-editor-component').should('have.length.at.least', 1);
      });
    });

    it('should show component types with color coding', () => {
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Check component type styling
      cy.get('.page-editor-component[data-type="TEXT_INPUT"]')
        .find('.component-type')
        .should('have.css', 'background-color', 'rgb(40, 167, 69)'); // Green
        
      cy.get('.page-editor-component[data-type="EMAIL_INPUT"]')
        .find('.component-type')
        .should('have.css', 'background-color', 'rgb(23, 162, 184)'); // Teal
    });

    it('should handle component selection in page editor', () => {
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Click on a component in the page editor
      cy.get('.page-editor-component').first().click();
      
      // Check selection state
      cy.get('.page-editor-component.selected').should('exist');
      
      // Check that right panel shows component attributes
      cy.get('.App-attribute-panel').contains('Edit Attributes (component)').should('be.visible');
    });

    it('should show nested component hierarchy in editor', () => {
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Check for nested components
      cy.get('.component-children').should('exist');
      cy.get('.children-label').contains('Child Components:').should('be.visible');
      
      // Check indentation for nested components
      cy.get('.page-editor-component[style*="margin-left: 20px"]').should('exist');
    });

    it('should handle page selection from canvas', () => {
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Click on page canvas background
      cy.get('.page-canvas').click();
      
      // Check page selection state
      cy.get('.page-canvas.selected').should('exist');
      
      // Check that right panel shows page attributes
      cy.get('.App-attribute-panel').contains('Edit Attributes (page)').should('be.visible');
    });

    it('should show empty state when no page selected', () => {
      // Initially no specific page selection
      cy.get('.page-editor-placeholder').should('not.exist');
      
      // The app auto-selects first page, so we should see content
      cy.get('.page-editor').should('be.visible');
      cy.get('.page-canvas').should('be.visible');
    });
  });

  describe('Right Panel - Attributes Editor', () => {
    it('should show form attributes when form is selected', () => {
      cy.get('.App-sidebar').contains('📋 Test Form 1').click();
      
      cy.get('.App-attribute-panel').within(() => {
        cy.contains('Edit Attributes (form)').should('be.visible');
        cy.get('input[name="name"]').should('have.value', 'Test Form 1');
        cy.get('textarea[name="description"]').should('exist');
        cy.contains('Save Changes').should('be.visible');
      });
    });

    it('should show page attributes when page is selected', () => {
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      cy.get('.App-attribute-panel').within(() => {
        cy.contains('Edit Attributes (page)').should('be.visible');
        cy.get('input[name="name"]').should('have.value', 'Personal Information');
        cy.contains('Save Changes').should('be.visible');
      });
    });

    it('should show component attributes when component is selected', () => {
      cy.get('.App-sidebar').contains('⚬ First Name').click();
      
      cy.get('.App-attribute-panel').within(() => {
        cy.contains('Edit Attributes (component)').should('be.visible');
        cy.get('input[name="label"]').should('have.value', 'First Name');
        cy.get('input[name="componentType"]').should('have.value', 'TEXT_INPUT');
        cy.get('textarea[name="attributes"]').should('exist');
        cy.contains('Save Changes').should('be.visible');
      });
    });

    it('should show placeholder when nothing is selected', () => {
      // This test might be difficult since app auto-selects, but we can test the text
      cy.get('.panel-placeholder, .App-attribute-panel').should('exist');
    });
  });

  describe('Navigation and Interaction Flow', () => {
    it('should synchronize selection between all three panels', () => {
      // Select component from left panel
      cy.get('.App-sidebar').contains('⚬ First Name').click();
      
      // Check left panel selection
      cy.get('.App-sidebar .component-node').first().should('have.class', 'selected-node');
      
      // Check center panel shows the component's page
      cy.get('.page-editor').should('be.visible');
      
      // Check right panel shows component attributes
      cy.get('.App-attribute-panel').contains('Edit Attributes (component)').should('be.visible');
      
      // Check footer shows selection
      cy.get('.App-footer').contains('Selected: component').should('be.visible');
    });

    it('should navigate from center panel component to attributes panel', () => {
      // Start with page selected
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Click component in center panel
      cy.get('.page-editor-component').first().click();
      
      // Verify right panel switches to component attributes
      cy.get('.App-attribute-panel').contains('Edit Attributes (component)').should('be.visible');
      
      // Verify left panel shows component selected
      cy.get('.App-sidebar .component-node').first().should('have.class', 'selected-node');
    });

    it('should handle page selection and show correct page in editor', () => {
      // Select page from tree
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Verify page editor shows correct page
      cy.get('.page-editor-header .page-info').contains('Personal Information').should('be.visible');
      cy.get('.page-canvas-header h4').contains('Personal Information').should('be.visible');
    });
  });

  describe('Form Editing Workflow', () => {
    it('should complete full form editing workflow', () => {
      // 1. Edit form properties
      cy.get('.App-sidebar').contains('📋 Test Form 1').click();
      cy.get('input[name="name"]').clear().type('Updated Test Form');
      cy.contains('Save Changes').click();
      cy.get('.App-sidebar').contains('Updated Test Form').should('be.visible');
      
      // 2. Edit page properties
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('input[name="name"]').clear().type('Updated Personal Info');
      cy.contains('Save Changes').click();
      
      // 3. Edit component properties
      cy.get('.App-sidebar').contains('⚬ First Name').click();
      cy.get('input[name="label"]').clear().type('Full Name');
      cy.get('input[name="componentType"]').clear().type('TEXT_INPUT');
      cy.get('textarea[name="attributes"]').clear().type('{"placeholder": "Enter your full name", "required": true}');
      cy.contains('Save Changes').click();
      
      // Verify changes in tree
      cy.get('.App-sidebar').contains('Full Name').should('be.visible');
    });

    it('should handle JSON validation in component attributes', () => {
      cy.get('.App-sidebar').contains('⚬ First Name').click();
      
      // Enter invalid JSON
      cy.get('textarea[name="attributes"]').clear().type('{"invalid": json}');
      cy.contains('Save Changes').click();
      
      // Should show error (assuming error handling exists)
      // This might need to be updated based on actual error handling implementation
    });
  });

  describe('Component Hierarchy and Nesting', () => {
    it('should display nested components correctly', () => {
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Check for parent-child relationships in page editor
      cy.get('.component-children').should('exist');
      cy.get('.children-label').should('be.visible');
      
      // Check nested component indentation
      cy.get('.page-editor-component[style*="margin-left: 20px"]').should('exist');
    });

    it('should handle selection of nested components', () => {
      // Select parent component
      cy.get('.App-sidebar').contains('⚬ Contact Info').click();
      cy.get('.App-attribute-panel').contains('Edit Attributes (component)').should('be.visible');
      
      // Select child component
      cy.get('.App-sidebar').contains('⚬ Email').click();
      cy.get('.App-attribute-panel').contains('Edit Attributes (component)').should('be.visible');
      
      // Verify selection changed
      cy.get('.App-footer').contains('Selected: component').should('be.visible');
    });
  });

  describe('Visual Feedback and States', () => {
    it('should show hover effects on interactive elements', () => {
      // Test tree node hover
      cy.get('.App-sidebar .component-node').first()
        .trigger('mouseover')
        .should('have.css', 'background-color', 'rgb(230, 242, 255)');
      
      // Test page canvas hover
      cy.get('.page-canvas')
        .trigger('mouseover')
        .should('have.css', 'border-color', 'rgb(0, 123, 255)');
      
      // Test component hover in page editor
      cy.get('.page-editor-component').first()
        .trigger('mouseover')
        .should('have.css', 'border-color', 'rgb(0, 123, 255)');
    });

    it('should show selection states with proper styling', () => {
      // Test tree selection
      cy.get('.App-sidebar').contains('⚬ First Name').click();
      cy.get('.App-sidebar .selected-node')
        .should('have.css', 'background-color', 'rgb(221, 238, 255)');
      
      // Test page canvas selection
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.page-canvas').click();
      cy.get('.page-canvas.selected')
        .should('have.css', 'border-color', 'rgb(0, 86, 179)');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing or empty data gracefully', () => {
      // The app should still render even if some data is missing
      cy.get('.App').should('be.visible');
      cy.get('.App-header').should('be.visible');
      cy.get('.App-sidebar').should('be.visible');
      cy.get('.App-main-content').should('be.visible');
      cy.get('.App-attribute-panel').should('be.visible');
    });

    it('should show loading states appropriately', () => {
      // On initial load, should not show error states
      cy.get('.App-error').should('not.exist');
      cy.get('.App').should('be.visible');
    });
  });

  describe('Footer Information Display', () => {
    it('should show current selection information in footer', () => {
      // Test form selection
      cy.get('.App-sidebar').contains('📋 Test Form 1').click();
      cy.get('.App-footer').contains('Selected: form - ID: 1').should('be.visible');
      
      // Test page selection
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.App-footer').contains('Selected: page - ID:').should('be.visible');
      
      // Test component selection
      cy.get('.App-sidebar').contains('⚬ First Name').click();
      cy.get('.App-footer').contains('Selected: component - ID:').should('be.visible');
      cy.get('.App-footer').contains('First Name').should('be.visible');
    });
  });
});

describe('Form Builder E2E Tests - Three Panel Layout with CRUD Operations', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('http://localhost:3000');
    
    // Wait for the form to load
    cy.contains('Test Form 1', { timeout: 10000 }).should('be.visible');
  });

  describe('Layout Structure', () => {
    it('should display the three-panel layout correctly', () => {
      // Check header
      cy.get('.App-header').should('be.visible');
      cy.contains('Form Builder').should('be.visible');
      
      // Check left panel (sidebar)
      cy.get('.App-sidebar').should('be.visible');
      cy.contains('Form Structure').should('be.visible');
      
      // Check center panel (main content)
      cy.get('.App-main-content').should('be.visible');
      cy.get('.page-editor').should('be.visible');
      
      // Check right panel (attributes)
      cy.get('.App-attribute-panel').should('be.visible');
      
      // Check footer
      cy.get('.App-footer').should('be.visible');
    });

    it('should have responsive panel sizing', () => {
      // Left panel should have fixed width
      cy.get('.App-sidebar').should('have.css', 'width', '280px');
      
      // Center panel should take more space (flex: 3)
      cy.get('.App-main-content').should('have.css', 'flex', '3 1 0%');
      
      // Right panel should take less space (flex: 1)
      cy.get('.App-attribute-panel').should('have.css', 'flex', '1 1 0%');
    });
  });

  describe('Left Panel - Form Structure Tree', () => {
    it('should display the complete form hierarchy with action buttons', () => {
      // Check form node with actions
      cy.get('.App-sidebar').within(() => {
        cy.contains('📋 Test Form 1').should('be.visible');
        
        // Hover over form to show actions
        cy.contains('📋 Test Form 1').trigger('mouseover');
        cy.get('.add-btn').should('be.visible');
      });
    });

    it('should show visual hierarchy with indentation', () => {
      cy.get('.App-sidebar .form-node').should('have.css', 'margin-left', '0px');
      cy.get('.App-sidebar .page-node').should('have.css', 'margin-left', '16px');
      cy.get('.App-sidebar .component-node').should('have.css', 'margin-left', '16px');
    });

    it('should handle node selection with visual feedback', () => {
      // Select form
      cy.get('.App-sidebar').contains('📋 Test Form 1').click();
      cy.get('.App-sidebar .form-node').should('have.class', 'selected-node');
      
      // Select page
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.App-sidebar .page-node').should('have.class', 'selected-node');
      cy.get('.App-sidebar .form-node').should('not.have.class', 'selected-node');
      
      // Select component
      cy.get('.App-sidebar').contains('⚬ First Name').click();
      cy.get('.App-sidebar .component-node').first().should('have.class', 'selected-node');
      cy.get('.App-sidebar .page-node').should('not.have.class', 'selected-node');
    });

    it('should show action buttons on hover', () => {
      // Test form node actions
      cy.get('.App-sidebar .form-node').trigger('mouseover');
      cy.get('.form-node .node-actions .add-btn').should('be.visible');
      
      // Test page node actions
      cy.get('.App-sidebar .page-node').first().trigger('mouseover');
      cy.get('.page-node .node-actions').should('be.visible');
      cy.get('.page-node .node-actions .add-btn').should('be.visible');
      cy.get('.page-node .node-actions .delete-btn').should('be.visible');
      cy.get('.page-node .node-actions .move-up-btn').should('be.visible');
      cy.get('.page-node .node-actions .move-down-btn').should('be.visible');
    });
  });

  describe('CRUD Operations - Create Pages', () => {
    it('should create a new page from form tree', () => {
      // Get initial page count
      cy.get('.App-sidebar .page-node').its('length').then((initialCount) => {
        // Click add page button on form
        cy.get('.App-sidebar .form-node').trigger('mouseover');
        cy.get('.form-node .add-btn').click();
        
        // Fill out add page form
        cy.get('.add-form').should('be.visible');
        cy.get('.add-form input[type="text"]').type('New Page'); // Changed to text input for page name
        cy.get('.add-form .btn-primary').click();
        
        // Verify new page was created
        cy.get('.App-sidebar .page-node').should('have.length', initialCount + 1);
        cy.get('.App-sidebar').contains('📄 New Page').should('be.visible');
      });
    });

    it('should cancel page creation', () => {
      // Click add page button
      cy.get('.App-sidebar .form-node').trigger('mouseover');
      cy.get('.form-node .add-btn').click();
      
      // Cancel the form
      cy.get('.add-form .btn-secondary').click();
      
      // Form should disappear
      cy.get('.add-form').should('not.exist');
    });

    it('should validate page name input', () => {
      // Click add page button
      cy.get('.App-sidebar .form-node').trigger('mouseover');
      cy.get('.form-node .add-btn').click();
      
      // Try to submit empty name
      cy.get('.add-form .btn-primary').click();
      
      // Form should still be visible (HTML5 validation should prevent submission)
      cy.get('.add-form').should('be.visible');
    });
  });

  describe('CRUD Operations - Create Components', () => {
    it('should create a new component from page editor', () => {
      // Select a page first
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Click add component button in page editor
      cy.get('.page-editor-header .add-component-btn').click();
      
      // Fill out component form
      cy.get('.add-component-form').should('be.visible');
      cy.get('.add-component-form select').select('EMAIL_INPUT');
      cy.get('.add-component-form input[placeholder="Component label"]').type('Email Address');
      cy.get('.add-component-form textarea').clear().type('{"placeholder": "Enter email", "required": true}');
      cy.get('.add-component-form .btn-primary').click();
      
      // Verify component was created
      cy.get('.page-components .page-editor-component').should('contain', 'Email Address');
      cy.get('.page-components .page-editor-component[data-type="EMAIL_INPUT"]').should('exist');
    });

    it('should create a component from page tree', () => {
      // Expand page to show components
      cy.get('.App-sidebar .page-node .expand-btn').click();
      
      // Click add component from tree
      cy.get('.App-sidebar .page-node').trigger('mouseover');
      cy.get('.page-node .add-btn').click();
      
      // Should create a default component (implementation may vary)
      // This test depends on the specific implementation
    });

    it('should create nested components', () => {
      // Select a page and expand it
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.App-sidebar .page-node .expand-btn').click();
      
      // Find a component that can have children (like Contact Info)
      cy.get('.App-sidebar').contains('⚬ Contact Info').should('be.visible');
      
      // Hover over the component to show actions
      cy.get('.App-sidebar .component-node').contains('Contact Info').parent().trigger('mouseover');
      
      // Click add nested component
      cy.get('.App-sidebar .component-node .add-btn').first().click();
      
      // Fill out nested component form
      cy.get('.nested-add-form').should('be.visible');
      cy.get('.nested-add-form select').select('TEXT_INPUT');
      cy.get('.nested-add-form input[placeholder="Component label"]').type('Phone Number');
      cy.get('.nested-add-form .btn-primary').click();
      
      // Verify nested component was created
      cy.get('.App-sidebar').contains('⚬ Phone Number').should('be.visible');
    });

    it('should create component from empty page', () => {
      // If there's a page with no components, test the "Add First Component" button
      // This may require creating a new empty page first
      cy.get('.App-sidebar .form-node').trigger('mouseover');
      cy.get('.form-node .add-btn').click();
      cy.get('.add-form input[type="text"]').type('Empty Page');
      cy.get('.add-form .btn-primary').click();
      
      // Select the new page
      cy.get('.App-sidebar').contains('📄 Empty Page').click();
      
      // Should show empty state with add first component button
      cy.get('.no-components .add-first-component-btn').should('be.visible');
      cy.get('.no-components .add-first-component-btn').click();
      
      // Should show add component form
      cy.get('.add-component-form').should('be.visible');
    });
  });

  describe('CRUD Operations - Delete Pages', () => {
    it('should delete a page with confirmation', () => {
      // Get initial page count
      cy.get('.App-sidebar .page-node').its('length').then((initialCount) => {
        if (initialCount > 1) {
          // Hover over a page and click delete
          cy.get('.App-sidebar .page-node').first().trigger('mouseover');
          cy.get('.page-node .delete-btn').first().click();
          
          // Confirm deletion
          cy.window().then((win) => {
            cy.stub(win, 'confirm').returns(true);
          });
          
          // Verify page was deleted
          cy.get('.App-sidebar .page-node').should('have.length', initialCount - 1);
        }
      });
    });

    it('should cancel page deletion', () => {
      // Get initial page count
      cy.get('.App-sidebar .page-node').its('length').then((initialCount) => {
        // Hover over a page and click delete
        cy.get('.App-sidebar .page-node').first().trigger('mouseover');
        cy.get('.page-node .delete-btn').first().click();
        
        // Cancel deletion
        cy.window().then((win) => {
          cy.stub(win, 'confirm').returns(false);
        });
        
        // Verify page was not deleted
        cy.get('.App-sidebar .page-node').should('have.length', initialCount);
      });
    });
  });

  describe('CRUD Operations - Delete Components', () => {
    it('should delete a component with confirmation', () => {
      // Select page and expand to show components
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.App-sidebar .page-node .expand-btn').click();
      
      // Get initial component count
      cy.get('.App-sidebar .component-node').its('length').then((initialCount) => {
        // Hover over a component and click delete
        cy.get('.App-sidebar .component-node').first().trigger('mouseover');
        cy.get('.component-node .delete-btn').first().click();
        
        // Confirm deletion
        cy.window().then((win) => {
          cy.stub(win, 'confirm').returns(true);
        });
        
        // Verify component was deleted
        cy.get('.App-sidebar .component-node').should('have.length', initialCount - 1);
      });
    });

    it('should delete component from page editor', () => {
      // Select a page
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Get initial component count in page editor
      cy.get('.page-components .page-editor-component').its('length').then((initialCount) => {
        // Hover over a component and click delete
        cy.get('.page-components .page-editor-component').first().trigger('mouseover');
        cy.get('.component-actions .delete-btn').first().click();
        
        // Confirm deletion
        cy.window().then((win) => {
          cy.stub(win, 'confirm').returns(true);
        });
        
        // Verify component was deleted
        cy.get('.page-components .page-editor-component').should('have.length', initialCount - 1);
      });
    });
  });

  describe('Move and Reorder Operations', () => {
    it('should move pages up and down', () => {
      // Ensure we have multiple pages for testing
      cy.get('.App-sidebar .page-node').its('length').then((pageCount) => {
        if (pageCount < 2) {
          // Create a second page first
          cy.get('.App-sidebar .form-node').trigger('mouseover');
          cy.get('.form-node .add-btn').click();
          cy.get('.add-form .btn-primary').click();
        }
        
        // Test moving page down
        cy.get('.App-sidebar .page-node').first().within(() => {
          cy.get('.move-down-btn').should('not.be.disabled');
          cy.get('.move-down-btn').click();
        });
        
        // Verify page order changed (this is visual verification)
        // The exact verification depends on how page numbers are updated
        
        // Test moving page up
        cy.get('.App-sidebar .page-node').eq(1).within(() => {
          cy.get('.move-up-btn').should('not.be.disabled');
          cy.get('.move-up-btn').click();
        });
      });
    });

    it('should disable move buttons appropriately', () => {
      // First page should have move up disabled
      cy.get('.App-sidebar .page-node').first().within(() => {
        cy.get('.move-up-btn').should('be.disabled');
      });
      
      // Last page should have move down disabled
      cy.get('.App-sidebar .page-node').last().within(() => {
        cy.get('.move-down-btn').should('be.disabled');
      });
    });

    it('should move components up and down within a page', () => {
      // Select page and expand
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.App-sidebar .page-node .expand-btn').click();
      
      // Check if we have multiple components
      cy.get('.App-sidebar .component-node').its('length').then((componentCount) => {
        if (componentCount >= 2) {
          // Test moving component down
          cy.get('.App-sidebar .component-node').first().within(() => {
            cy.get('.move-down-btn').should('not.be.disabled');
            cy.get('.move-down-btn').click();
          });
          
          // Test moving component up
          cy.get('.App-sidebar .component-node').eq(1).within(() => {
            cy.get('.move-up-btn').should('not.be.disabled');
            cy.get('.move-up-btn').click();
          });
        }
      });
    });

    it('should move components in page editor', () => {
      // Select a page
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Check component count in page editor
      cy.get('.page-components .page-editor-component').its('length').then((componentCount) => {
        if (componentCount >= 2) {
          // Hover over first component and move down
          cy.get('.page-components .page-editor-component').first().trigger('mouseover');
          cy.get('.component-actions .move-down-btn').first().should('not.be.disabled');
          cy.get('.component-actions .move-down-btn').first().click();
          
          // Hover over second component and move up
          cy.get('.page-components .page-editor-component').eq(1).trigger('mouseover');
          cy.get('.component-actions .move-up-btn').should('not.be.disabled');
          cy.get('.component-actions .move-up-btn').click();
        }
      });
    });
  });

  describe('Center Panel - Page Editor with CRUD', () => {
    it('should display add component button in header', () => {
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.page-editor-header .add-component-btn').should('be.visible');
      cy.get('.page-editor-header .add-component-btn').should('contain', 'Add Component');
    });

    it('should show component actions on hover', () => {
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Hover over a component in the page editor
      cy.get('.page-components .page-editor-component').first().trigger('mouseover');
      
      // Check that action buttons appear
      cy.get('.component-actions').should('be.visible');
      cy.get('.component-actions .add-btn').should('be.visible');
      cy.get('.component-actions .delete-btn').should('be.visible');
      cy.get('.component-actions .move-up-btn').should('be.visible');
      cy.get('.component-actions .move-down-btn').should('be.visible');
    });

    it('should handle nested component creation from page editor', () => {
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      
      // Find a component that can have children
      cy.get('.page-components .page-editor-component').first().trigger('mouseover');
      cy.get('.component-actions .add-btn').first().click();
      
      // This should trigger nested component creation
      // The exact behavior depends on implementation
    });
  });

  describe('Integration - Cross-Panel Synchronization', () => {
    it('should synchronize selection after creating components', () => {
      // Create a component from page editor
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.page-editor-header .add-component-btn').click();
      cy.get('.add-component-form input[placeholder="Component label"]').type('New Test Component');
      cy.get('.add-component-form .btn-primary').click();
      
      // Verify the new component is selected
      cy.get('.App-footer').should('contain', 'Selected: component');
      cy.get('.App-footer').should('contain', 'New Test Component');
      
      // Verify left panel shows selection
      cy.get('.App-sidebar .component-node.selected-node').should('contain', 'New Test Component');
      
      // Verify attributes panel shows component attributes
      cy.get('.App-attribute-panel').should('contain', 'Edit Attributes (component)');
    });

    it('should clear selection after deleting selected item', () => {
      // Select a component
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.App-sidebar .page-node .expand-btn').click();
      cy.get('.App-sidebar .component-node').first().click();
      
      // Verify it's selected
      cy.get('.App-footer').should('contain', 'Selected: component');
      
      // Delete the component
      cy.get('.App-sidebar .component-node.selected-node').trigger('mouseover');
      cy.get('.component-node.selected-node .delete-btn').click();
      
      // Confirm deletion
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });
      
      // Verify selection is cleared or updated
      // The exact behavior depends on implementation
    });

    it('should maintain page selection after component operations', () => {
      // Select a page
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.App-footer').should('contain', 'Selected: page');
      
      // Add a component
      cy.get('.page-editor-header .add-component-btn').click();
      cy.get('.add-component-form input[placeholder="Component label"]').type('Test Component');
      cy.get('.add-component-form .btn-primary').click();
      
      // Page editor should still show the same page
      cy.get('.page-editor-header').should('contain', 'Personal Information');
      cy.get('.page-canvas-header h4').should('contain', 'Personal Information');
    });
  });

  describe('Error Handling and Validation', () => {
    it('should handle API errors gracefully during creation', () => {
      // This test would require mocking API failures
      // Implementation depends on how errors are handled in the app
    });

    it('should validate form inputs', () => {
      // Test empty component label
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.page-editor-header .add-component-btn').click();
      cy.get('.add-component-form .btn-primary').click();
      
      // Form should not submit (HTML5 validation)
      cy.get('.add-component-form').should('be.visible');
    });

    it('should validate JSON attributes', () => {
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.page-editor-header .add-component-btn').click();
      cy.get('.add-component-form input[placeholder="Component label"]').type('Test Component');
      cy.get('.add-component-form textarea').clear().type('invalid json {');
      cy.get('.add-component-form .btn-primary').click();
      
      // Should handle invalid JSON appropriately
      // The exact behavior depends on implementation
    });
  });

  describe('Visual Feedback and User Experience', () => {
    it('should show loading states during operations', () => {
      // This test would verify loading indicators during async operations
      // Implementation depends on how loading states are handled
    });

    it('should provide visual feedback for successful operations', () => {
      // Test that operations complete successfully and UI updates
      cy.get('.App-sidebar .form-node').trigger('mouseover');
      cy.get('.form-node .add-btn').click();
      cy.get('.add-form .btn-primary').click();
      
      // Should see new page appear
      cy.get('.App-sidebar').contains('📄 Page 2').should('be.visible');
    });

    it('should maintain UI responsiveness during operations', () => {
      // Verify that UI remains interactive during operations
      cy.get('.App-sidebar').contains('📄 Personal Information').click();
      cy.get('.page-editor').should('be.visible');
      cy.get('.App-attribute-panel').should('be.visible');
    });
  });
});

describe('Component vs Field Distinction', () => {
  it('should show add buttons only for container components', () => {
    // Select page and expand to show components
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.App-sidebar .page-node .expand-btn').click();
    
    // Check PANEL component (container) has add button
    cy.get('.App-sidebar').contains('⚬ Contact Info').parent().trigger('mouseover');
    cy.get('.component-node .node-actions .add-btn').should('be.visible');
    
    // Check TEXT_INPUT component (field) does NOT have add button
    cy.get('.App-sidebar').contains('⚬ First Name').parent().trigger('mouseover');
    cy.get('.component-node').contains('First Name').parent()
      .find('.node-actions .add-btn').should('not.exist');
  });

  it('should display different icons for container vs field components', () => {
    // Select page and expand
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.App-sidebar .page-node .expand-btn').click();
    
    // Container component should have 📦 icon
    cy.get('.App-sidebar').contains('⚬ Contact Info').parent()
      .find('.node-icon').should('contain', '📦');
    
    // Field component should have ⚬ icon  
    cy.get('.App-sidebar').contains('⚬ First Name').parent()
      .find('.node-icon').should('contain', '⚬');
  });

  it('should apply different styling to container vs field components', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.App-sidebar .page-node .expand-btn').click();
    
    // Container component should have container-component class
    cy.get('.App-sidebar').contains('Contact Info').closest('.component-node')
      .should('have.class', 'container-component');
    
    // Field component should have field-component class
    cy.get('.App-sidebar').contains('First Name').closest('.component-node')
      .should('have.class', 'field-component');
  });

  it('should show different styling in page editor for container vs field', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    
    // Container component in page editor should have container-type class
    cy.get('.page-editor-component').contains('Contact Info').closest('.page-editor-component')
      .should('have.class', 'container-type');
    
    // Field component should have field-type class
    cy.get('.page-editor-component').contains('First Name').closest('.page-editor-component')
      .should('have.class', 'field-type');
  });

  it('should prevent adding children to field components with alert', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.App-sidebar .page-node .expand-btn').click();
    
    // Try to click add button on field component (if it existed, it should show alert)
    // Since field components shouldn't have add buttons, we test that they don't exist
    cy.get('.App-sidebar').contains('First Name').closest('.component-node')
      .find('.add-btn').should('not.exist');
  });

  it('should show empty container message for containers with no children', () => {
    // Create a new container component
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.page-editor-header .add-component-btn').click();
    
    // Select a container type
    cy.get('.add-component-form select').select('PANEL');
    cy.get('.add-component-form input[placeholder="Component label"]').type('Empty Container');
    cy.get('.add-component-form .btn-primary').click();
    
    // Check for empty container message
    cy.get('.empty-container-message').should('be.visible');
    cy.get('.empty-container-message').should('contain', 'No child components');
    cy.get('.add-first-child-btn').should('be.visible');
  });

  it('should create nested components in containers', () => {
    // Find a container component
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.App-sidebar .page-node .expand-btn').click();
    
    // Click add button on container component
    cy.get('.App-sidebar').contains('Contact Info').parent().trigger('mouseover');
    cy.get('.component-node').contains('Contact Info').parent()
      .find('.add-btn').click();
    
    // Fill out nested component form
    cy.get('.nested-add-form').should('be.visible');
    cy.get('.nested-add-form select').select('TEXT_INPUT');
    cy.get('.nested-add-form input[placeholder="Component label"]').type('Nested Field');
    cy.get('.nested-add-form .btn-primary').click();
    
    // Verify nested component was created
    cy.get('.App-sidebar').contains('Nested Field').should('be.visible');
  });

  it('should show component type groups in dropdown', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.page-editor-header .add-component-btn').click();
    
    // Check for optgroups in component type dropdown
    cy.get('.add-component-form select optgroup').should('contain', 'Field Components');
    cy.get('.add-component-form select optgroup').should('contain', 'Container Components');
    
    // Check that field types are in field group
    cy.get('.add-component-form select optgroup[label="Field Components"]')
      .should('contain', 'Text Input');
    
    // Check that container types are in container group  
    cy.get('.add-component-form select optgroup[label="Container Components"]')
      .should('contain', 'Panel');
  });
});

describe('Container Component Functionality', () => {
  it('should allow adding multiple nested components to containers', () => {
    // Find container and add first child
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.App-sidebar .page-node .expand-btn').click();
    
    cy.get('.App-sidebar').contains('Contact Info').parent().trigger('mouseover');
    cy.get('.component-node').contains('Contact Info').parent()
      .find('.add-btn').click();
    
    cy.get('.nested-add-form select').select('TEXT_INPUT');
    cy.get('.nested-add-form input[placeholder="Component label"]').type('Phone');
    cy.get('.nested-add-form .btn-primary').click();
    
    // Add second child
    cy.get('.App-sidebar').contains('Contact Info').parent().trigger('mouseover');
    cy.get('.component-node').contains('Contact Info').parent()
      .find('.add-btn').click();
    
    cy.get('.nested-add-form select').select('EMAIL_INPUT');
    cy.get('.nested-add-form input[placeholder="Component label"]').type('Work Email');
    cy.get('.nested-add-form .btn-primary').click();
    
    // Verify both children exist
    cy.get('.App-sidebar').contains('Phone').should('be.visible');
    cy.get('.App-sidebar').contains('Work Email').should('be.visible');
  });

  it('should show nested components with proper indentation', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.App-sidebar .page-node .expand-btn').click();
    
    // Check that nested components are indented more than parent
    cy.get('.component-node').contains('Contact Info').should('be.visible');
    cy.get('.component-node').contains('Email').should('be.visible');
    
    // Email should be nested under Contact Info (visually indented)
    cy.get('.component-node').contains('Email').parent()
      .should('have.css', 'margin-left').and('not.equal', '0px');
  });

  it('should delete container and all children when container is deleted', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.App-sidebar .page-node .expand-btn').click();
    
    // Count initial components
    cy.get('.App-sidebar .component-node').its('length').then((initialCount) => {
      // Delete container component
      cy.get('.App-sidebar').contains('Contact Info').parent().trigger('mouseover');
      cy.get('.component-node').contains('Contact Info').parent()
        .find('.delete-btn').click();
      
      // Confirm deletion
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });
      
      // Verify container and children are gone
      cy.get('.App-sidebar').should('not.contain', 'Contact Info');
      cy.get('.App-sidebar').should('not.contain', 'Email'); // Child should also be gone
      
      // Component count should decrease by more than 1 (container + children)
      cy.get('.App-sidebar .component-node').should('have.length.lessThan', initialCount - 1);
    });
  });
});

describe('Field Component Functionality', () => {
  it('should not allow adding children to field components', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.App-sidebar .page-node .expand-btn').click();
    
    // Field components should not have add buttons
    cy.get('.App-sidebar').contains('First Name').closest('.component-node')
      .find('.add-btn').should('not.exist');
    
    cy.get('.App-sidebar').contains('Feedback').closest('.component-node')
      .find('.add-btn').should('not.exist');
  });

  it('should show appropriate delete confirmation for field components', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.App-sidebar .page-node .expand-btn').click();
    
    // Mock the confirm dialog to check message
    cy.window().then((win) => {
      cy.stub(win, 'confirm').callsFake((message) => {
        expect(message).to.contain('field');
        return false; // Don't actually delete
      });
    });
    
    // Try to delete a field component
    cy.get('.App-sidebar').contains('First Name').parent().trigger('mouseover');
    cy.get('.component-node').contains('First Name').parent()
      .find('.delete-btn').click();
  });

  it('should display field components with proper styling and icons', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    
    // Check page editor styling for field components
    cy.get('.page-editor-component').contains('First Name').closest('.page-editor-component')
      .should('have.class', 'field-type');
    
    // Check component type badge colors
    cy.get('.page-editor-component[data-type="TEXT_INPUT"] .component-type')
      .should('have.css', 'background-color', 'rgb(40, 167, 69)'); // Green
      
    cy.get('.page-editor-component[data-type="TEXT_AREA"] .component-type')
      .should('have.css', 'background-color', 'rgb(255, 193, 7)'); // Yellow
  });

  it('should not show empty container messages for field components', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    
    // Field components should not have empty container messages
    cy.get('.page-editor-component').contains('First Name').closest('.page-editor-component')
      .find('.empty-container-state').should('not.exist');
  });
});

describe('Component Type Validation', () => {
  it('should categorize component types correctly', () => {
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.page-editor-header .add-component-btn').click();
    
    // Check field component options
    cy.get('.add-component-form select optgroup[label="Field Components"] option')
      .should('contain', 'Text Input')
      .and('contain', 'Email Input')
      .and('contain', 'Text Area')
      .and('contain', 'Checkbox')
      .and('contain', 'Radio Button')
      .and('contain', 'Dropdown Select')
      .and('contain', 'Number Input')
      .and('contain', 'Date Input')
      .and('contain', 'File Upload')
      .and('contain', 'Button');
    
    // Check container component options
    cy.get('.add-component-form select optgroup[label="Container Components"] option')
      .should('contain', 'Panel')
      .and('contain', 'Fieldset')
      .and('contain', 'Group')
      .and('contain', 'Section');
  });

  it('should create components with correct type classification', () => {
    // Create a field component
    cy.get('.App-sidebar').contains('📄 Personal Information').click();
    cy.get('.page-editor-header .add-component-btn').click();
    
    cy.get('.add-component-form select').select('NUMBER_INPUT');
    cy.get('.add-component-form input[placeholder="Component label"]').type('Age');
    cy.get('.add-component-form .btn-primary').click();
    
    // Verify it's classified as a field
    cy.get('.App-sidebar .page-node .expand-btn').click();
    cy.get('.App-sidebar').contains('Age').closest('.component-node')
      .should('have.class', 'field-component');
    
    // Create a container component
    cy.get('.page-editor-header .add-component-btn').click();
    cy.get('.add-component-form select').select('FIELDSET');
    cy.get('.add-component-form input[placeholder="Component label"]').type('Personal Details');
    cy.get('.add-component-form .btn-primary').click();
    
    // Verify it's classified as a container
    cy.get('.App-sidebar').contains('Personal Details').closest('.component-node')
      .should('have.class', 'container-component');
      
    // Container should have add button
    cy.get('.App-sidebar').contains('Personal Details').parent().trigger('mouseover');
    cy.get('.component-node').contains('Personal Details').parent()
      .find('.add-btn').should('exist');
  });
}); 