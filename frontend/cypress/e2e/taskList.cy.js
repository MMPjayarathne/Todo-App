/* eslint-disable no-undef */
// cypress/e2e/taskList.cy.js

describe('TaskList Component', () => {
  beforeEach(() => {
    // Visit the page where TaskList is rendered
    cy.visit('/');
    
    cy.intercept('GET', `${Cypress.env('BACKEND_URL')}`, { fixture: 'tasks.json' }).as('getTasks');
    cy.intercept('DELETE', `${Cypress.env('BACKEND_URL')}/*`, { statusCode: 200 }).as('deleteTask');
    cy.intercept('PUT', `${Cypress.env('BACKEND_URL')}/*/done`, { statusCode: 200 }).as('markTaskDone');
  });

  it('should display loading state initially', () => {
    cy.get('[role="progressbar"]').should('be.visible');
    cy.wait('@getTasks');
  });

  it('should display empty state when no tasks exist', () => {
    cy.intercept('GET', `${Cypress.env('BACKEND_URL')}`, { body: [] }).as('getEmptyTasks');
    
    cy.visit('/');
    cy.wait('@getEmptyTasks');
    cy.contains('No Tasks Available').should('be.visible');
    cy.contains('Get started by adding a new task!').should('be.visible');
  });

  it('should display list of tasks correctly', () => {
    const tasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        updatedAt: '2025-02-24T10:00:00Z'
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        updatedAt: '2025-02-24T11:00:00Z'
      }
    ];

    cy.intercept('GET', `${Cypress.env('BACKEND_URL')}`, { body: tasks }).as('getTasks');

    cy.get('.MuiCard-root').should('have.length', 2); 
    cy.contains('Task 1').should('be.visible');
    cy.contains('Task 2').should('be.visible');
  });

  it('should handle task deletion', () => {
    cy.get('button').contains('Delete').first().click();
    
    cy.contains('Are you sure you want to delete').should('be.visible');
    
    cy.get('button[name="confirm"]').click(); 
    
    cy.wait('@deleteTask');
    cy.contains('Task deleted successfully').should('be.visible');
  });

  it('should handle marking task as done', () => {
    cy.get('button').contains('Done').first().click(); 
    cy.wait('@markTaskDone');
    cy.contains('Task updated successfully').should('be.visible');
  });

  it('should trigger edit mode when edit button is clicked', () => {
    cy.get('[name="editIcon"]').first().click();
    
    cy.get('input[name="title"]').should('have.value', 'Task 1');
    cy.get('textarea[name="description"]').should('have.value', 'Description for Task 1');
  });

  it('should handle the Fetch API error gracefully', () => {
    cy.intercept('GET', `${Cypress.env('BACKEND_URL')}`, {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('getTasksError');
    cy.visit('/');

    cy.wait('@getTasksError');

    cy.get('.MuiSnackbar-root', { timeout: 10000 }).should('be.visible');
    cy.contains('An unexpected error occurred. Please try again.').should('be.visible');
  });

  it('should handle the Delete API error gracefully', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.clear(); 
        win.sessionStorage.clear(); 
      }
    });
    cy.wait('@getTasks');

    cy.intercept('DELETE', `${Cypress.env('BACKEND_URL')}/*`, {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('deleteTaskError');

    cy.get('button').contains('Delete').first().click(); 
    cy.get('button[name="confirm"]').click(); 

    cy.contains('An unexpected error occurred. Please try again.').should('be.visible');
  });

  it('should handle mobile viewport correctly', () => {

    cy.viewport('iphone-x');
    
    cy.get('.MuiTypography-h6').should('have.css', 'font-size', '20px'); 
    
    cy.get('.MuiCardContent-root').last().within(() => {
      cy.get('button').should('have.css', 'flex-direction', 'row'); 
    });
  });
});