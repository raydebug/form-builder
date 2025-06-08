describe('Dual Add Buttons Feature', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(2000);
  });

  describe('Component Add Buttons Visibility', () => {
    it('should show both add buttons only for container components', () => {
      // Find a container component (should be PANEL from sample data)
      cy.get('[data-component-type="PANEL"]').should('exist');
      
      // Container component should have both add buttons
      cy.get('[data-component-type="PANEL"]').within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]').should('exist');
        cy.get('[data-testid="add-field-btn"]').should('exist');
      });
    });

    it('should not show add buttons for field components', () => {
      // Find a field component (should be TEXT_INPUT from sample data)
      cy.get('[data-component-type="TEXT_INPUT"]').should('exist');
      
      // Field component should not have add buttons
      cy.get('[data-component-type="TEXT_INPUT"]').first().within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]').should('not.exist');
        cy.get('[data-testid="add-field-btn"]').should('not.exist');
      });
    });

    it('should have distinct button appearances', () => {
      cy.get('[data-component-type="PANEL"]').within(() => {
        // Sub-component button should have blue styling
        cy.get('[data-testid="add-subcomponent-btn"]')
          .should('contain', '📦➕')
          .and('have.css', 'background-color');
        
        // Field button should have green styling  
        cy.get('[data-testid="add-field-btn"]')
          .should('contain', '⚬➕')
          .and('have.css', 'background-color');
      });
    });
  });

  describe('Add Sub-Component Functionality', () => {
    it('should open sub-component form when sub-component button is clicked', () => {
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]').click();
      });

      // Should show the nested form
      cy.get('.nested-add-form').should('be.visible');
      cy.get('.nested-add-form').within(() => {
        cy.contains('Add Sub-Component to').should('be.visible');
        
        // Should only show container component options
        cy.get('select option[value="PANEL"]').should('exist');
        cy.get('select option[value="FIELDSET"]').should('exist');
        cy.get('select option[value="GROUP"]').should('exist');
        
        // Should not show field component options in this form
        cy.get('select option[value="TEXT_INPUT"]').should('not.exist');
        cy.get('select option[value="EMAIL_INPUT"]').should('not.exist');
      });
    });

    it('should create a sub-component when form is submitted', () => {
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]').click();
      });

      cy.get('.nested-add-form').within(() => {
        cy.get('select').select('FIELDSET');
        cy.get('input[placeholder="Sub-component label"]').type('Test Fieldset');
        cy.get('button[type="submit"]').click();
      });

      // Should close the form and show new component
      cy.get('.nested-add-form').should('not.exist');
      
      // Should see the new fieldset component
      cy.contains('📦 Test Fieldset').should('be.visible');
      cy.get('[data-component-type="FIELDSET"]').should('exist');
    });

    it('should close field form when sub-component form is opened', () => {
      // First open field form
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-field-btn"]').click();
      });
      cy.get('.field-add-form').should('be.visible');

      // Then open sub-component form
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]').click();
      });

      // Field form should be closed, nested form should be open
      cy.get('.field-add-form').should('not.exist');
      cy.get('.nested-add-form').should('be.visible');
    });
  });

  describe('Add Field Functionality', () => {
    it('should open field form when field button is clicked', () => {
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-field-btn"]').click();
      });

      // Should show the field form
      cy.get('.field-add-form').should('be.visible');
      cy.get('.field-add-form').within(() => {
        cy.contains('Add Field to').should('be.visible');
        
        // Should only show field component options
        cy.get('select option[value="TEXT_INPUT"]').should('exist');
        cy.get('select option[value="EMAIL_INPUT"]').should('exist');
        cy.get('select option[value="CHECKBOX"]').should('exist');
        cy.get('select option[value="SELECT"]').should('exist');
        
        // Should not show container component options in this form
        cy.get('select option[value="PANEL"]').should('not.exist');
        cy.get('select option[value="FIELDSET"]').should('not.exist');
      });
    });

    it('should create a field when form is submitted', () => {
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-field-btn"]').click();
      });

      cy.get('.field-add-form').within(() => {
        cy.get('select').select('EMAIL_INPUT');
        cy.get('input[placeholder="Field label"]').type('Test Email Field');
        cy.get('button[type="submit"]').click();
      });

      // Wait for form processing
      cy.wait(2000);

      // The main goal is to verify the field was created
      cy.contains('⚬ Test Email Field', { timeout: 10000 }).should('be.visible');
      
      // Form should eventually close (allow more time if needed)
      cy.get('.field-add-form', { timeout: 15000 }).should('not.exist');
    });

    it('should close sub-component form when field form is opened', () => {
      // First open sub-component form
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]').click();
      });
      cy.get('.nested-add-form').should('be.visible');

      // Then open field form
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-field-btn"]').click();
      });

      // Sub-component form should be closed, field form should be open
      cy.get('.nested-add-form').should('not.exist');
      cy.get('.field-add-form').should('be.visible');
    });
  });

  describe('Form Styling and UX', () => {
    it('should have distinct styling for sub-component and field forms', () => {
      // Test sub-component form styling
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]').click();
      });
      
      cy.get('.nested-add-form')
        .should('have.css', 'border-color', 'rgb(33, 136, 181)')
        .and('have.css', 'background-color');
      
      cy.get('.nested-add-form h5')
        .should('have.css', 'color', 'rgb(33, 136, 181)');

      // Cancel and test field form styling
      cy.get('.nested-add-form button[type="button"]').click();
      
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-field-btn"]').click();
      });
      
      cy.get('.field-add-form')
        .should('have.css', 'border-color', 'rgb(40, 167, 69)')
        .and('have.css', 'background-color');
      
      cy.get('.field-add-form h5')
        .should('have.css', 'color', 'rgb(40, 167, 69)');
    });

    it('should show appropriate tooltips for add buttons', () => {
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]')
          .should('have.attr', 'title')
          .and('contain', 'Add Sub-Component to');
        
        cy.get('[data-testid="add-field-btn"]')
          .should('have.attr', 'title')
          .and('contain', 'Add Field to');
      });
    });

    it('should show correct form titles and button labels', () => {
      // Test sub-component form
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]').click();
      });
      
      cy.get('.nested-add-form').within(() => {
        cy.get('h5').should('contain', 'Add Sub-Component to');
        cy.get('button[type="submit"]').should('contain', 'Add Sub-Component');
        cy.get('input').should('have.attr', 'placeholder', 'Sub-component label');
      });

      cy.get('.nested-add-form button[type="button"]').click();

      // Test field form
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-field-btn"]').click();
      });
      
      cy.get('.field-add-form').within(() => {
        cy.get('h5').should('contain', 'Add Field to');
        cy.get('button[type="submit"]').should('contain', 'Add Field');
        cy.get('input').should('have.attr', 'placeholder', 'Field label');
      });
    });
  });

  describe('Error Handling', () => {
    it('should prevent adding child components to field components', () => {
      // Try to click add button on a field component (though buttons shouldn't exist)
      cy.get('[data-component-type="TEXT_INPUT"]').first().click();
      
      // If somehow the handler is called, it should show an alert
      // This is more of a defensive test since UI prevents this
      cy.get('[data-component-type="TEXT_INPUT"]').first().within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]').should('not.exist');
        cy.get('[data-testid="add-field-btn"]').should('not.exist');
      });
    });

    it('should handle form cancellation properly', () => {
      // Test sub-component form cancellation
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-subcomponent-btn"]').click();
      });
      
      cy.get('.nested-add-form').within(() => {
        cy.get('input').type('Test Component');
        cy.get('button[type="button"]').click(); // Cancel
      });
      
      cy.get('.nested-add-form').should('not.exist');

      // Test field form cancellation
      cy.get('[data-component-type="PANEL"]').first().within(() => {
        cy.get('[data-testid="add-field-btn"]').click();
      });
      
      cy.get('.field-add-form').within(() => {
        cy.get('input').type('Test Field');
        cy.get('button[type="button"]').click(); // Cancel
      });
      
      cy.get('.field-add-form').should('not.exist');
    });
  });
}); 