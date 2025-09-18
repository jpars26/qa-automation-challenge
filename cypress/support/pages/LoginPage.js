// cypress/support/pages/LoginPage.js
export class LoginPage {
  visit() {
    cy.visit("/login");
  }
  fillUsername(username) {
    cy.get("#userName").clear().type(username);
  }
  fillPassword(password) {
    cy.get("#password").clear().type(password, { log: false });
  }
  submit() {
    cy.get("#login").click();
  }
  assertLoggedIn(expectedUser) {
    cy.url().should("include", "/profile");
    cy.get("#userName-value").should("be.visible");
    if (expectedUser) {
      cy.get("#userName-value").should("have.text", expectedUser);
    }
  }
}
