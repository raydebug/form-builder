describe('Form Editor E2E Tests', () => {
  beforeEach(() => {
    // For now, we assume the backend is running and has seeded data.
    // A more robust setup might involve cy.request() to ensure backend is ready
    // or to programmatically seed data if DataLoader wasn't used.
    cy.visit('/'); // Visit the baseUrl (localhost:3000)
  });

  it('should load the pre-seeded form and display its structure', () => {
    // Wait for the form data to load and the FormTree to render
    // Increased timeout for initial load, especially in potentially slow CI environments
    cy.contains('h2', 'Test Form 1', { timeout: 20000 }).should('be.visible');
    cy.contains('p', 'A default form for E2E testing.').should('be.visible');

    // Check for Page 1
    cy.contains('.page-node .page-content span', 'Page: 1').should('be.visible');

    // Check for "First Name" component
    cy.contains('.component-node .component-content span', 'First Name').should('be.visible');

    // Check for "Feedback" component
    cy.contains('.component-node .component-content span', 'Feedback').should('be.visible');

    // Check for "Contact Info" panel
    cy.contains('.component-node .component-content span', 'Contact Info').should('be.visible');

    // Check for nested "Email" component
    // This selector might need adjustment based on how nested components are rendered within .component-children
    cy.contains('.component-node .component-children .component-node .component-content span', 'Email').should('be.visible');
  });

  it('should select a component and display its attributes in the panel', () => {
    cy.contains('h2', 'Test Form 1', { timeout: 20000 }).should('be.visible'); // Ensure form is loaded

    // Click on the "First Name" component node
    cy.contains('.component-node .component-content span', 'First Name').click();

    // Verify the attribute panel shows the correct details
    cy.get('.App-attribute-panel').should('be.visible');
    cy.get('.App-attribute-panel h3').should('contain.text', 'Edit Attributes (component)');

    // Check label
    cy.get('.App-attribute-panel label[for="label"]').next('input').should('have.value', 'First Name');

    // Check component type
    cy.get('.App-attribute-panel label[for="componentType"]').next('input').should('have.value', 'TEXT_INPUT');

    // Check attributes JSON
    // The value in textarea might be pretty-printed JSON.
    // We can check if it contains the essential parts.
    cy.get('.App-attribute-panel label[for="attributes"]').next('textarea')
      .invoke('val') // Get the value of the textarea
      .then(jsonString => {
        const attributes = JSON.parse(jsonString);
        expect(attributes).to.have.property('placeholder', 'Enter your first name');
      });

    // Verify selection is reflected in the footer (example)
    cy.get('.App-footer').should('contain.text', 'Selected: component')
                         .and('contain.text', 'First Name');
  });

  it('should edit a component label and persist the change', () => {
    cy.contains('h2', 'Test Form 1', { timeout: 20000 }).should('be.visible');
    cy.contains('.component-node .component-content span', 'First Name').click();

    // Intercept the PUT request for updating the component
    cy.intercept('PUT', '/api/components/*').as('updateComponent');

    // Edit the label
    cy.get('.App-attribute-panel label[for="label"]').next('input')
      .clear()
      .type('Full Name')
      .should('have.value', 'Full Name');

    // Click save
    cy.get('.App-attribute-panel .save-button').click();

    // Wait for the update request to complete and assert its success
    cy.wait('@updateComponent').its('response.statusCode').should('eq', 200);

    // After save, the form re-fetches and re-renders.
    // The selected node might be lost or reset depending on App.js logic.
    // For this test, let's re-select and verify the change in the panel.

    // Verify the change is reflected in the tree (if it updates dynamically, or re-query)
    // This depends on how App.js handles re-rendering and state after update.
    // For now, we'll check the panel after re-selecting.
    cy.contains('.component-node .component-content span', 'Full Name', { timeout: 5000 }).should('be.visible').click();

    // Verify in attribute panel again
    cy.get('.App-attribute-panel label[for="label"]').next('input').should('have.value', 'Full Name');
  });

  it('should edit component attributes (JSON) and persist the change', () => {
    cy.contains('h2', 'Test Form 1', { timeout: 20000 }).should('be.visible');
    cy.contains('.component-node .component-content span', 'Feedback').click(); // Select the "Feedback" component

    cy.intercept('PUT', '/api/components/*').as('updateComponent');

    const newAttributes = {
      "rows": 5,
      "maxLength": 200
    };

    // Edit attributes JSON
    cy.get('.App-attribute-panel label[for="attributes"]').next('textarea')
      .clear()
      .type(JSON.stringify(newAttributes, null, 2), { parseSpecialCharSequences: false }); // Type as raw string

    cy.get('.App-attribute-panel .save-button').click();
    cy.wait('@updateComponent').its('response.statusCode').should('eq', 200);

    // Re-select and verify
    cy.contains('.component-node .component-content span', 'Feedback', { timeout: 5000 }).click();
    cy.get('.App-attribute-panel label[for="attributes"]').next('textarea')
      .invoke('val')
      .then(jsonString => {
        const attributes = JSON.parse(jsonString);
        expect(attributes).to.deep.equal(newAttributes);
      });
  });

});
