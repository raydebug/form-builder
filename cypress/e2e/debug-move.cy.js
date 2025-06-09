describe('Debug Move Functionality', () => {
  it('should debug move button clicks and console logs', () => {
    // Visit the application
    cy.visit('http://localhost:3000');
    
    // Wait for form to load
    cy.get('[data-testid="form-tree"]', { timeout: 10000 }).should('be.visible');
    
    // Check if we have pages
    cy.get('.page-node').then($pages => {
      cy.log(`Found ${$pages.length} pages`);
      
      // If we have less than 2 pages, create another one
      if ($pages.length < 2) {
        cy.get('.form-node').find('[title="Add Page"]').click();
        cy.get('.add-form input[placeholder="Page name"]').type('Debug Test Page');
        cy.get('.add-form .btn-primary').click();
        cy.wait(1000);
      }
      
      // Now test moving
      cy.get('.page-node').should('have.length.at.least', 2);
      
      // Get the second page and try to move it up
      cy.get('.page-node').eq(1).then($secondPage => {
        const pageText = $secondPage.find('.tree-text').text();
        cy.log(`Attempting to move page: ${pageText}`);
        
        // Hover over the page to show buttons
        cy.get('.page-node').eq(1).trigger('mouseover');
        cy.wait(500);
        
        // Check if move buttons exist
        cy.get('.page-node').eq(1).find('[title="Move Up"]').should('exist').then($btn => {
          cy.log(`Move Up button exists: ${$btn.length > 0}`);
          cy.log(`Button disabled: ${$btn.prop('disabled')}`);
        });
        
        // Click the move up button
        cy.get('.page-node').eq(1).find('[title="Move Up"]').click();
        
        // Wait for potential API call
        cy.wait(2000);
        
        // Check if order changed
        cy.get('.page-node .tree-text').then($newPages => {
          const newOrder = Array.from($newPages).map(el => el.textContent.trim());
          cy.log('Page order after move:', newOrder);
        });
      });
    });
  });
}); 