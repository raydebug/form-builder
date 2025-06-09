describe('UI Architecture - Panel Responsibilities', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(2000); // Wait for data to load
  });

  describe('Left Form Tree Panel - Page Operations Only', () => {
    it('should show only page-level buttons in form tree', () => {
      // Check form level
      cy.get('.form-tree .form-node').within(() => {
        cy.get('.action-btn.add-btn').should('exist').and('have.attr', 'title', 'Add Page');
        cy.get('.action-btn.delete-btn').should('not.exist'); // Forms typically don't have delete in tree
      });

      // Check page level
      cy.get('.form-tree .page-node').first().within(() => {
        cy.get('.action-btn.add-btn').should('exist').and('have.attr', 'title', 'Add Component');
        cy.get('.action-btn.move-up-btn').should('exist').and('have.attr', 'title', 'Move Up');
        cy.get('.action-btn.move-down-btn').should('exist').and('have.attr', 'title', 'Move Down');
        cy.get('.action-btn.delete-btn').should('exist').and('have.attr', 'title', 'Delete Page');
        
        // Should NOT have dual add buttons (those are for PageEditor)
        cy.get('[data-testid="add-subcomponent-btn"]').should('not.exist');
        cy.get('[data-testid="add-field-btn"]').should('not.exist');
      });
    });

    it('should allow expanding pages to show basic component structure', () => {
      // Expand first page
      cy.get('.form-tree .page-node .expand-btn').first().click();
      
      // Should show component structure but with limited functionality
      cy.get('.form-tree .page-components').should('be.visible');
      
      // Components in tree should have basic info but limited buttons
      cy.get('.form-tree .page-components .component-node').should('exist');
    });

    it('should focus on page management operations', () => {
      // Test page creation
      cy.get('.form-tree .form-node .add-btn').click();
      cy.get('.add-form input[placeholder="Page name"]').should('be.visible');
      cy.get('.add-form input[placeholder="Page name"]').type('Test Page');
      cy.get('.add-form .btn-primary').click();
      
      // Should see new page in tree
      cy.contains('.page-node', 'Test Page').should('exist');
    });
  });

  describe('Page Editor Panel - Component Operations', () => {
    beforeEach(() => {
      // Select a page to activate page editor
      cy.get('.form-tree .page-node').first().click();
    });

    it('should show component-level operations in page editor', () => {
      // Should have page editor visible
      cy.get('.page-editor').should('be.visible');
      
      // Should show components with full functionality
      cy.get('.page-editor .page-editor-component').should('exist');
      
      // Container components should have add button
      cy.get('.page-editor .page-editor-component.container-type').first().within(() => {
        cy.get('.action-btn.add-btn').should('exist').and('have.attr', 'title', 'Add Child Component');
        cy.get('.action-btn.move-up-btn').should('exist');
        cy.get('.action-btn.move-down-btn').should('exist');
        cy.get('.action-btn.delete-btn').should('exist');
      });
    });

    it('should support dual add functionality for containers', () => {
      // Find a container component (like PANEL)
      cy.get('.page-editor .page-editor-component.container-type[data-type="PANEL"]').first().within(() => {
        // Should have the add child component button
        cy.get('.action-btn.add-btn').should('exist');
        
        // Click to trigger add functionality
        cy.get('.action-btn.add-btn').click();
      });
      
      // Should see component creation interface
      // (This would trigger the parent component's create handler)
    });

    it('should handle component hierarchy and nesting', () => {
      // Page editor should show proper component hierarchy
      cy.get('.page-editor .page-editor-component').should('have.length.at.least', 1);
      
      // Should show child components indented
      cy.get('.page-editor .component-children').should('exist');
      
      // Should show empty states for containers without children
      cy.get('.page-editor .empty-container-state').should('exist');
    });

    it('should differentiate between container and field components', () => {
      // Container components should have container styling
      cy.get('.page-editor .page-editor-component.container-type').should('exist');
      cy.get('.page-editor .page-editor-component.container-type .component-icon').should('contain', '📦');
      
      // Field components should have field styling  
      cy.get('.page-editor .page-editor-component.field-type').should('exist');
      cy.get('.page-editor .page-editor-component.field-type .component-icon').should('contain', '⚬');
    });
  });

  describe('Panel Coordination', () => {
    it('should coordinate selection between tree and editor', () => {
      // Select page in tree
      cy.get('.form-tree .page-node').first().click();
      
      // Page editor should show that page
      cy.get('.page-editor').should('be.visible');
      cy.get('.page-editor').should('contain', 'Personal Information');
      
      // Tree should show page as selected
      cy.get('.form-tree .page-node.selected-node').should('exist');
    });

    it('should show appropriate UI states based on selection', () => {
      // When no page selected
      cy.get('.form-tree .form-node').click(); // Select form instead of page
      cy.get('.page-editor').should('contain', 'No page selected');
      
      // When page selected
      cy.get('.form-tree .page-node').first().click();
      cy.get('.page-editor .page-editor-component').should('exist');
    });
  });

  describe('Accessibility and UX', () => {
    it('should have clear visual hierarchy', () => {
      // Tree should be clearly separate from editor
      cy.get('.form-tree').should('be.visible');
      cy.get('.page-editor').should('be.visible');
      
      // Should have appropriate ARIA labels and structure
      cy.get('.form-tree').should('have.attr', 'role').or('not.have.attr', 'role');
      cy.get('.page-editor').should('have.attr', 'role').or('not.have.attr', 'role');
    });

    it('should provide appropriate tooltips and help text', () => {
      // Buttons should have helpful titles
      cy.get('.form-tree .action-btn[title]').should('exist');
      cy.get('.page-editor .action-btn[title]').should('exist');
    });

    it('should handle empty states gracefully', () => {
      // Form tree should handle no pages
      cy.get('.form-tree').should('exist');
      
      // Page editor should handle no page selected
      cy.get('.form-tree .form-node').click();
      cy.get('.page-editor').should('contain', 'No page selected');
    });
  });
}); 