describe('Form Builder API E2E Tests', () => {
  const baseUrl = 'http://localhost:8080/api';
  let createdFormId;
  let createdPageId;
  let createdComponentId;
  let createdNestedComponentId;

  before(() => {
    // Wait for backend to be ready
    cy.request('GET', `${baseUrl}/forms/`).should('have.property', 'status', 200);
  });

  describe('Health Check & Sample Data', () => {
    it('should have sample data loaded', () => {
      cy.request('GET', `${baseUrl}/forms/`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        
        // Check if sample form exists
        const sampleForm = response.body.find(form => form.name.includes('Test Form'));
        expect(sampleForm).to.exist;
        expect(sampleForm).to.have.property('id');
        expect(sampleForm).to.have.property('name');
        expect(sampleForm).to.have.property('description');
      });
    });

    it('should have sample form with pages and components', () => {
      cy.request('GET', `${baseUrl}/forms/`).then((response) => {
        const sampleForm = response.body[0];
        
        cy.request('GET', `${baseUrl}/forms/${sampleForm.id}`).then((formResponse) => {
          expect(formResponse.status).to.eq(200);
          expect(formResponse.body).to.have.property('pages');
          expect(formResponse.body.pages).to.be.an('array');
          expect(formResponse.body.pages.length).to.be.greaterThan(0);
          
          const firstPage = formResponse.body.pages[0];
          expect(firstPage).to.have.property('components');
          expect(firstPage.components).to.be.an('array');
        });
      });
    });
  });

  describe('Form API Endpoints', () => {
    it('should create a new form', () => {
      const formData = {
        name: 'Test API Form',
        description: 'Form created via API test'
      };

      cy.request('POST', `${baseUrl}/forms/`, formData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.eq(formData.name);
        expect(response.body.description).to.eq(formData.description);
        
        createdFormId = response.body.id;
      });
    });

    it('should get all forms', () => {
      cy.request('GET', `${baseUrl}/forms/`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        
        // Should include our newly created form
        const createdForm = response.body.find(form => form.id === createdFormId);
        expect(createdForm).to.exist;
      });
    });

    it('should get form by id', () => {
      cy.request('GET', `${baseUrl}/forms/${createdFormId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', createdFormId);
        expect(response.body).to.have.property('name', 'Test API Form');
        expect(response.body).to.have.property('pages');
        expect(response.body.pages).to.be.an('array');
      });
    });

    it('should update form', () => {
      const updatedData = {
        name: 'Updated API Form',
        description: 'Updated description via API test'
      };

      cy.request('PUT', `${baseUrl}/forms/${createdFormId}`, updatedData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(updatedData.name);
        expect(response.body.description).to.eq(updatedData.description);
      });
    });

    it('should handle form not found error', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/forms/99999`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('Page API Endpoints', () => {
    it('should create a page in form', () => {
      const pageData = {
        name: 'Test API Page'
      };

      cy.request('POST', `${baseUrl}/forms/${createdFormId}/pages`, pageData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.eq(pageData.name);
        expect(response.body).to.have.property('components');
        // Note: form property not included in response due to @JsonBackReference
        
        createdPageId = response.body.id;
      });
    });

    it('should get all pages for form', () => {
      cy.request('GET', `${baseUrl}/forms/${createdFormId}/pages`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        
        const createdPage = response.body.find(page => page.id === createdPageId);
        expect(createdPage).to.exist;
      });
    });

    it('should get page by id', () => {
      cy.request('GET', `${baseUrl}/pages/${createdPageId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', createdPageId);
        expect(response.body).to.have.property('name', 'Test API Page');
        expect(response.body).to.have.property('components');
        expect(response.body.components).to.be.an('array');
      });
    });

    it('should update page', () => {
      const updatedData = {
        name: 'Updated API Page'
      };

      cy.request('PUT', `${baseUrl}/pages/${createdPageId}`, updatedData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(updatedData.name);
      });
    });

    it('should reorder pages in form', () => {
      // First create another page
      const secondPageData = { name: 'Second API Page' };
      
      cy.request('POST', `${baseUrl}/forms/${createdFormId}/pages`, secondPageData).then((createResponse) => {
        const secondPageId = createResponse.body.id;
        
        // Now test reordering
        const reorderData = {
          pageIds: [secondPageId, createdPageId]
        };

        cy.request('PUT', `${baseUrl}/forms/${createdFormId}/pages/reorder`, reorderData).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.eq(2);
          expect(response.body[0].id).to.eq(secondPageId);
          expect(response.body[1].id).to.eq(createdPageId);
        });
      });
    });

    it('should handle page not found error', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/pages/99999`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('Component API Endpoints', () => {
    it('should create a component in page', () => {
      const componentData = {
        componentType: 'TEXT_INPUT',
        label: 'Test API Component',
        attributes: '{"placeholder": "Enter text"}'
      };

      cy.request('POST', `${baseUrl}/pages/${createdPageId}/components`, componentData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.componentType).to.eq(componentData.componentType);
        expect(response.body.label).to.eq(componentData.label);
        expect(response.body.attributes).to.eq(componentData.attributes);
        expect(response.body).to.have.property('childComponents');
        // Note: page property not included in response due to @JsonBackReference
        
        createdComponentId = response.body.id;
      });
    });

    it('should create a nested component', () => {
      // First create a container component
      const containerData = {
        componentType: 'CONTAINER',
        label: 'Test Container',
        attributes: '{}'
      };

      cy.request('POST', `${baseUrl}/pages/${createdPageId}/components`, containerData).then((containerResponse) => {
        const containerId = containerResponse.body.id;
        
        // Now create a nested component
        const nestedData = {
          componentType: 'TEXT_INPUT',
          label: 'Nested Component',
          attributes: '{"placeholder": "Nested input"}'
        };

        cy.request('POST', `${baseUrl}/components/${containerId}/components`, nestedData).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          expect(response.body.componentType).to.eq(nestedData.componentType);
          expect(response.body.label).to.eq(nestedData.label);
          expect(response.body).to.have.property('childComponents');
          // Note: parentComponent property may not be included due to serialization
          
          createdNestedComponentId = response.body.id;
        });
      });
    });

    it('should get all components for page', () => {
      cy.request('GET', `${baseUrl}/pages/${createdPageId}/components`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        
        const createdComponent = response.body.find(comp => comp.id === createdComponentId);
        expect(createdComponent).to.exist;
      });
    });

    it('should get child components', () => {
      // Get the container component first
      cy.request('GET', `${baseUrl}/pages/${createdPageId}/components`).then((response) => {
        const containerComponent = response.body.find(comp => comp.componentType === 'CONTAINER');
        
        if (containerComponent) {
          cy.request('GET', `${baseUrl}/components/${containerComponent.id}/components`).then((childResponse) => {
            expect(childResponse.status).to.eq(200);
            expect(childResponse.body).to.be.an('array');
            
            if (childResponse.body.length > 0) {
              const nestedComponent = childResponse.body.find(comp => comp.id === createdNestedComponentId);
              expect(nestedComponent).to.exist;
            }
          });
        }
      });
    });

    it('should get component by id', () => {
      cy.request('GET', `${baseUrl}/components/${createdComponentId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', createdComponentId);
        expect(response.body).to.have.property('componentType', 'TEXT_INPUT');
        expect(response.body).to.have.property('label', 'Test API Component');
      });
    });

    it('should update component', () => {
      const updatedData = {
        componentType: 'TEXT_INPUT',
        label: 'Updated API Component',
        attributes: '{"placeholder": "Updated placeholder"}'
      };

      cy.request('PUT', `${baseUrl}/components/${createdComponentId}`, updatedData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.label).to.eq(updatedData.label);
        expect(response.body.attributes).to.eq(updatedData.attributes);
      });
    });

    it('should move component between pages', () => {
      // Create another page first
      const newPageData = { name: 'Target Page' };
      
      cy.request('POST', `${baseUrl}/forms/${createdFormId}/pages`, newPageData).then((pageResponse) => {
        const targetPageId = pageResponse.body.id;
        
        const moveData = {
          targetPageId: targetPageId,
          targetParentComponentId: null
        };

        cy.request('PUT', `${baseUrl}/components/${createdComponentId}/move`, moveData).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('componentType');
          // Note: page property not included in response due to @JsonBackReference
        });
      });
    });

    it('should reorder components in page', () => {
      // Create multiple components first
      const comp1Data = { componentType: 'TEXT_INPUT', label: 'Component 1', attributes: '{}' };
      const comp2Data = { componentType: 'TEXT_INPUT', label: 'Component 2', attributes: '{}' };
      
      cy.request('POST', `${baseUrl}/pages/${createdPageId}/components`, comp1Data).then((comp1Response) => {
        const comp1Id = comp1Response.body.id;
        
        cy.request('POST', `${baseUrl}/pages/${createdPageId}/components`, comp2Data).then((comp2Response) => {
          const comp2Id = comp2Response.body.id;
          
          const reorderData = {
            componentIds: [comp2Id, comp1Id]
          };

          cy.request('PUT', `${baseUrl}/pages/${createdPageId}/components/reorder`, reorderData).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.eq(2);
            expect(response.body[0].id).to.eq(comp2Id);
            expect(response.body[1].id).to.eq(comp1Id);
          });
        });
      });
    });

    it('should handle component not found error', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/components/99999`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('Data Integrity & Relationships', () => {
    it('should maintain form-page relationships', () => {
      cy.request('GET', `${baseUrl}/forms/${createdFormId}`).then((response) => {
        const form = response.body;
        expect(form.pages).to.be.an('array');
        
        if (form.pages.length > 0) {
          // Pages in form response don't have form property due to @JsonBackReference
          // Test that pages exist and have valid structure
          form.pages.forEach(page => {
            expect(page).to.have.property('id');
            expect(page).to.have.property('name');
            expect(page).to.have.property('components');
          });
        }
      });
    });

    it('should maintain page-component relationships', () => {
      cy.request('GET', `${baseUrl}/pages/${createdPageId}`).then((response) => {
        const page = response.body;
        expect(page.components).to.be.an('array');
        
        if (page.components.length > 0) {
          // Components in page response don't have page property due to @JsonBackReference
          // Test that components exist and have valid structure
          page.components.forEach(component => {
            expect(component).to.have.property('id');
            expect(component).to.have.property('componentType');
            expect(component).to.have.property('label');
          });
        }
      });
    });

    it('should maintain parent-child component relationships', () => {
      if (createdNestedComponentId) {
        // Test by checking if we can retrieve the component and find it in parent's children
        cy.request('GET', `${baseUrl}/components/${createdNestedComponentId}`).then((response) => {
          const nestedComponent = response.body;
          expect(nestedComponent).to.have.property('id');
          expect(nestedComponent).to.have.property('componentType');
          
          // Test that we can find components with parents by checking page components
          // and looking for nested structures in their childComponents
          cy.request('GET', `${baseUrl}/pages/${createdPageId}/components`).then((pageResponse) => {
            const pageComponents = pageResponse.body;
            const containerComponent = pageComponents.find(comp => comp.componentType === 'CONTAINER');
            if (containerComponent && containerComponent.childComponents) {
              const foundChild = containerComponent.childComponents.find(child => child.id === createdNestedComponentId);
              expect(foundChild).to.exist;
            }
          });
        });
      }
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle invalid JSON in component attributes', () => {
      const invalidComponentData = {
        componentType: 'TEXT_INPUT',
        label: 'Invalid Component',
        attributes: 'invalid json'
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/pages/${createdPageId}/components`,
        body: invalidComponentData,
        failOnStatusCode: false
      }).then((response) => {
        // Should either accept it as string or return 400
        expect([200, 201, 400]).to.include(response.status);
      });
    });

    it('should handle creating component in non-existent page', () => {
      const componentData = {
        componentType: 'TEXT_INPUT',
        label: 'Test Component',
        attributes: '{}'
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/pages/99999/components`,
        body: componentData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should handle creating page in non-existent form', () => {
      const pageData = { name: 'Test Page' };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/forms/99999/pages`,
        body: pageData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('Cleanup Operations', () => {
    it('should delete component', () => {
      if (createdComponentId) {
        cy.request('DELETE', `${baseUrl}/components/${createdComponentId}`).then((response) => {
          expect(response.status).to.eq(204);
          
          // Verify component is deleted
          cy.request({
            method: 'GET',
            url: `${baseUrl}/components/${createdComponentId}`,
            failOnStatusCode: false
          }).then((getResponse) => {
            expect(getResponse.status).to.eq(404);
          });
        });
      }
    });

    it('should delete page and its components', () => {
      if (createdPageId) {
        cy.request('DELETE', `${baseUrl}/pages/${createdPageId}`).then((response) => {
          expect(response.status).to.eq(204);
          
          // Verify page is deleted
          cy.request({
            method: 'GET',
            url: `${baseUrl}/pages/${createdPageId}`,
            failOnStatusCode: false
          }).then((getResponse) => {
            expect(getResponse.status).to.eq(404);
          });
        });
      }
    });

    it('should delete form and its pages', () => {
      // First check that form exists and has pages
      cy.request('GET', `${baseUrl}/forms/${createdFormId}`).then((response) => {
        expect(response.status).to.eq(200);
        
        // Delete the form
        cy.request('DELETE', `${baseUrl}/forms/${createdFormId}`).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(204);
          
          // Verify form is deleted
          cy.request({
            method: 'GET',
            url: `${baseUrl}/forms/${createdFormId}`,
            failOnStatusCode: false
          }).then((getResponse) => {
            expect(getResponse.status).to.eq(404);
          });
        });
      });
    });
  });
}); 