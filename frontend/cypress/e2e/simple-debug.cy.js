describe('Simple Debug Test', () => {
  it('should load the app and check for basic elements', () => {
    cy.visit('http://localhost:3000');
    
    // Wait for app to load
    cy.wait(2000);
    
    // Check if basic layout exists
    cy.get('.App').should('exist');
    cy.get('.App-sidebar').should('exist');
    
    // Log what's actually in the sidebar
    cy.get('.App-sidebar').then(($sidebar) => {
      cy.log('Sidebar content:', $sidebar.text());
    });
    
    // Check if form tree exists
    cy.get('.form-tree').should('exist');
    
    // Check if any node-text elements exist
    cy.get('.node-text').should('exist');
    
    // Log the first node-text content
    cy.get('.node-text').first().then(($el) => {
      cy.log('First node-text:', $el.text());
    });
  });
}); 