// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", () => {
  cy.visit("http://localhost:3000/");
  cy.get("button").contains("Sign in with email").click();
  cy.wait(500);
  cy.get('input[type="email"]').type("e2e@test.com");
  cy.get("button").contains("Next").click();
  cy.wait(500);
  cy.get('input[type="password"]').type("e2e@test.com");
  cy.get("button[type='submit'").click();
  cy.wait(5000);
});

Cypress.Commands.add("logout", () => {
  cy.get("button").contains("Log Out").click();
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
