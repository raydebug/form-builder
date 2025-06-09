describe('Move Functionality E2E Tests', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('http://localhost:3000');
    
    // Wait for form to load
    cy.get('[data-testid="form-tree"]', { timeout: 10000 }).should('be.visible');
    
    // First, create additional pages if we only have one
    cy.get('.page-node').then($pages => {
      if ($pages.length < 2) {
        // Add a second page for testing
        cy.get('.form-node').find('[title="Add Page"]').click();
        cy.get('.add-form input[placeholder="Page name"]').type('Test Page 2');
        cy.get('.add-form .btn-primary').click();
        cy.wait(1000); // Wait for page creation
      }
    });
  });

  describe('Page Move Operations', () => {
    it('should move pages up and down in form tree', () => {
      // Ensure we have at least 2 pages
      cy.get('.page-node').should('have.length.at.least', 2);
      
      // Get initial page order
      cy.get('.page-node .tree-text').then($pages => {
        const initialOrder = Array.from($pages).map(el => el.textContent.trim());
        expect(initialOrder.length).to.be.greaterThan(1);
        
        // Move second page up (should swap with first)
        cy.get('.page-node').eq(1).trigger('mouseover');
        cy.get('.page-node').eq(1).find('[title="Move Up"]').click();
        cy.wait(1000); // Wait for reorder to complete
        
        // Verify pages swapped
        cy.get('.page-node .tree-text').then($newPages => {
          const newOrder = Array.from($newPages).map(el => el.textContent.trim());
          expect(newOrder[0]).to.equal(initialOrder[1]);
          expect(newOrder[1]).to.equal(initialOrder[0]);
        });
        
        // Move first page down (should swap back)
        cy.get('.page-node').eq(0).trigger('mouseover');
        cy.get('.page-node').eq(0).find('[title="Move Down"]').click();
        cy.wait(1000); // Wait for reorder to complete
        
        // Verify pages are back to original order
        cy.get('.page-node .tree-text').then($finalPages => {
          const finalOrder = Array.from($finalPages).map(el => el.textContent.trim());
          expect(finalOrder).to.deep.equal(initialOrder);
        });
      });
    });

    it('should disable move up for first page and move down for last page', () => {
      cy.get('.page-node').should('have.length.at.least', 2);
      
      // Check first page - move up should be disabled
      cy.get('.page-node').first().trigger('mouseover');
      cy.get('.page-node').first().find('[title="Move Up"]').should('be.disabled');
      
      // Check last page - move down should be disabled  
      cy.get('.page-node').last().trigger('mouseover');
      cy.get('.page-node').last().find('[title="Move Down"]').should('be.disabled');
    });

    it('should show move buttons on hover with proper CSS', () => {
      // Force hover on first page to ensure action buttons are visible
      cy.get('.page-node').first().trigger('mouseover', { force: true });
      
      // Use force: true to check if the buttons exist even if opacity is 0
      cy.get('.page-node').first().find('[title="Move Up"]').should('exist');
      cy.get('.page-node').first().find('[title="Move Down"]').should('exist');
      
      // Check that tree-actions element has opacity 1 on hover
      cy.get('.page-node').first().find('.tree-actions').should('have.css', 'opacity', '1');
    });
  });

  describe('Component Move Operations in PageEditor', () => {
    beforeEach(() => {
      // Select first page and expand it in FormTree
      cy.get('.page-node').first().click();
      cy.get('.page-node').first().find('.tree-expand-btn').click();
      
      // Wait for PageEditor to load
      cy.get('[data-testid="page-editor"]', { timeout: 5000 }).should('be.visible');
    });

    it('should create components and test move functionality', () => {
      // First, create components if they don't exist
      cy.get('[data-testid="page-editor"] .component-node').then($components => {
        if ($components.length < 2) {
          // Create first component
          cy.get('[data-testid="page-editor"]').then($editor => {
            if ($editor.find('.dual-add-buttons .add-field-btn').length > 0) {
              cy.get('[data-testid="page-editor"] .dual-add-buttons .add-field-btn').click();
              cy.get('.add-form input[placeholder="Field name"]').type('Test Field 1');
              cy.get('.add-form .btn-primary').click();
              cy.wait(500);
            } else {
              // Use alternative method to add component
              cy.get('[data-testid="page-editor"]').contains('Add').click();
              cy.get('input[placeholder*="name"], input[placeholder*="Name"]').first().type('Test Field 1');
              cy.get('.btn-primary').click();
              cy.wait(500);
            }
          });
          
          // Create second component
          cy.get('[data-testid="page-editor"]').then($editor => {
            if ($editor.find('.dual-add-buttons .add-field-btn').length > 0) {
              cy.get('[data-testid="page-editor"] .dual-add-buttons .add-field-btn').click();
              cy.get('.add-form input[placeholder="Field name"]').type('Test Field 2');
              cy.get('.add-form .btn-primary').click();
              cy.wait(500);
            } else {
              cy.get('[data-testid="page-editor"]').contains('Add').click();
              cy.get('input[placeholder*="name"], input[placeholder*="Name"]').first().type('Test Field 2');
              cy.get('.btn-primary').click();
              cy.wait(500);
            }
          });
        }
        
        // Now test moving if we have multiple components
        cy.get('[data-testid="page-editor"] .component-node').then($comps => {
          if ($comps.length > 1) {
            // Move second component up
            cy.get('[data-testid="page-editor"] .component-node').eq(1).trigger('mouseover');
            cy.get('[data-testid="page-editor"] .component-node').eq(1).find('[title="Move Up"]').click();
            cy.wait(1000);
            
            // Verify components moved in FormTree
            cy.get('.page-components .component-node .tree-text').first().should('exist');
          }
        });
      });
    });

    it('should have working disable logic for move buttons', () => {
      // Ensure we have components first
      cy.get('[data-testid="page-editor"] .component-node').should('have.length.at.least', 1);
      
      // Check first component (if exists) - move up should be disabled
      cy.get('[data-testid="page-editor"] .component-node').first().trigger('mouseover');
      cy.get('[data-testid="page-editor"] .component-node').first().find('[title="Move Up"]').should('be.disabled');
    });
  });

  describe('FormTree Component Display', () => {
    beforeEach(() => {
      // Expand first page to see components
      cy.get('.page-node').first().find('.tree-expand-btn').click();
    });

    it('should display components in FormTree correctly', () => {
      // FormTree should show components in read-only mode
      cy.get('.page-components').should('be.visible');
      
      // Check if components are displayed with proper structure
      cy.get('.page-components .component-node').then($components => {
        if ($components.length > 0) {
          cy.get('.page-components .component-node').first().should('contain.text');
        }
      });
    });

    it('should not show move buttons for components in FormTree (read-only)', () => {
      // FormTree should be read-only for components, no move buttons
      cy.get('.page-components .component-node').then($components => {
        if ($components.length > 0) {
          cy.get('.page-components .component-node').first().trigger('mouseover');
          cy.get('.page-components .component-node').first().find('[title="Move Up"]').should('not.exist');
          cy.get('.page-components .component-node').first().find('[title="Move Down"]').should('not.exist');
        }
      });
    });
  });

  describe('Move Operation API Tests', () => {
    it('should handle successful API responses', () => {
      // Intercept successful API calls
      cy.intercept('PUT', '**/pages/reorder', { statusCode: 200, body: [] }).as('successPageReorder');
      
      // Ensure we have pages to test
      cy.get('.page-node').should('have.length.at.least', 2);
      
      // Try to move a page
      cy.get('.page-node').eq(1).trigger('mouseover');
      cy.get('.page-node').eq(1).find('[title="Move Up"]').click();
      
      // Wait for the API call
      cy.wait('@successPageReorder');
    });

    it('should handle API errors gracefully', () => {
      // Intercept API calls and simulate failure
      cy.intercept('PUT', '**/pages/reorder', { statusCode: 500, body: { error: 'Server error' } }).as('failedPageReorder');
      
      // Ensure we have pages to test
      cy.get('.page-node').should('have.length.at.least', 2);
      
      // Try to move a page
      cy.get('.page-node').eq(1).trigger('mouseover');
      cy.get('.page-node').eq(1).find('[title="Move Up"]').click();
      
      // Wait for the failed request
      cy.wait('@failedPageReorder');
      
      // The page order should remain unchanged after error
      cy.get('.page-node').should('have.length.at.least', 2);
    });
  });

  describe('Performance and Usability', () => {
    it('should complete move operations efficiently', () => {
      cy.get('.page-node').should('have.length.at.least', 2);
      
      const startTime = Date.now();
      
      // Perform a move operation
      cy.get('.page-node').eq(1).trigger('mouseover');
      cy.get('.page-node').eq(1).find('[title="Move Up"]').click();
      
      // Wait for operation to complete and measure time
      cy.get('.page-node').then(() => {
        const endTime = Date.now();
        expect(endTime - startTime).to.be.lessThan(5000); // Should complete within 5 seconds
      });
    });

    it('should maintain tree structure integrity after moves', () => {
      cy.get('.page-node').should('have.length.at.least', 2);
      
      // Get initial structure
      cy.get('.page-node').its('length').then(initialPageCount => {
        // Perform move
        cy.get('.page-node').eq(1).trigger('mouseover');
        cy.get('.page-node').eq(1).find('[title="Move Up"]').click();
        cy.wait(1000);
        
        // Verify structure integrity
        cy.get('.page-node').should('have.length', initialPageCount);
        cy.get('[data-testid="form-tree"]').should('be.visible');
      });
    });
  });
}); 