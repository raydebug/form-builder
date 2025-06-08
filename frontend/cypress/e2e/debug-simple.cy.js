describe('Debug Form Tree', () => {
  it('should show what is actually in the sidebar', () => {
    cy.visit('http://localhost:3000');
    
    // Wait for the app to load
    cy.wait(3000);
    
    // Check if sidebar exists
    cy.get('.App-sidebar').should('exist');
    
    // Log the entire sidebar content
    cy.get('.App-sidebar').then(($sidebar) => {
      console.log('Sidebar HTML:', $sidebar.html());
      console.log('Sidebar text:', $sidebar.text());
    });
    
    // Check for any form-related elements
    cy.get('.App-sidebar').within(() => {
      cy.get('*').each(($el) => {
        const text = $el.text();
        if (text.includes('Test') || text.includes('Form') || text.includes('Personal')) {
          console.log('Found element with relevant text:', text);
        }
      });
    });
    
    // Take a screenshot for debugging
    cy.screenshot('sidebar-debug');
  });
}); 