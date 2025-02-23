/* eslint-disable no-undef */
describe('TaskForm Component', () => {
    beforeEach(() => {
      //initial URL is defined in the cypress.config.js file
      cy.visit('/');
      
      cy.intercept('POST', `${Cypress.env('BACKEND_URL')}`, { 
        statusCode: 201, 
        body: { message: 'Task created successfully' } 
      }).as('createTask');
      
      cy.intercept('PUT', `${Cypress.env('BACKEND_URL')}/*`, { 
        statusCode: 200, 
        body: { message: 'Task updated successfully' } 
      }).as('updateTask');
    });
  
    it('should render the form correctly', () => {
      cy.contains('Add a New Task').should('be.visible');
  
      cy.get('label').contains('Title').should('exist');
      cy.get('label').contains('Description').should('exist');
  
      cy.get('button').contains('Save').should('be.disabled');
    });
  
  
    it('should validate field length limits', () => {
        const longTitle = 'a'.repeat(51);
        const longDescription = 'a'.repeat(256);
    
        cy.get('input[name="title"]').type(longTitle);
        cy.get('textarea[name="description"]').type(longDescription);
        cy.get('button').contains('Save').click();
    
        cy.contains('Title cannot exceed 50 characters').should('be.visible');
        cy.contains('Description cannot exceed 255 characters').should('be.visible');
     });
  
    it('should successfully add a new task', () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test Description'
      };
  
      cy.get('input[name="title"]').type(newTask.title);
      cy.get('textarea[name="description"]').type(newTask.description);
  
      cy.get('button').contains('Save').click();
  
      cy.wait('@createTask').its('request.body').should('deep.equal', newTask);
      cy.contains('Task added successfully').should('be.visible');
    });
  
    it('should successfully edit an existing task', () => {
        const taskToEdit = {
          id: 1,
          title: 'Updated Title',
          description: 'Updated Description'
        };
      
        cy.window().then((win) => {
          win.selectedTask = {
            id: 1,
            title: 'Original Title',
            description: 'Original Description'
          };
        });
      
        cy.get('button[name="editIcon"]').first().click();

        cy.contains('Edit Task').should('be.visible');
      
        cy.get('input[name="title"]').clear().type(taskToEdit.title);
        cy.get('textarea[name="description"]').clear().type(taskToEdit.description);
    
        cy.get('input[name="title"]').then(($input) => {
          console.log('Title:', $input.val());
        });
        cy.get('textarea[name="description"]').then(($textarea) => {
          console.log('Description:', $textarea.val());
        });
      
        cy.get('button').contains('Save').click();
      
        cy.wait('@updateTask', { timeout: 10000 })
          .its('request.body')
          .should('deep.equal', {
            title: taskToEdit.title,
            description: taskToEdit.description
          });
      });
  
    it('should handle mobile layout correctly', () => {
      cy.viewport('iphone-x');
      cy.get('button[name="addIcon"]').click();
      
        
      
      cy.contains('Cancel').should('be.visible'); 
      cy.contains('Cancel').should('have.css', 'font-size', '10.4px'); 
    });
  
    it('should handle API errors appropriately', () => {
      // Simulate an API error
      cy.intercept('POST', `${Cypress.env('BACKEND_URL')}`, {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('createTaskError');
  
      cy.get('input[name="title"]').type('Test Task');
      cy.get('textarea[name="description"]').type('Test Description');
  
      cy.get('button').contains('Save').click();
  
      // Verify error handling
      cy.wait('@createTaskError');
      cy.contains('An unexpected error occurred. Please try again.').should('be.visible');
    });
  });