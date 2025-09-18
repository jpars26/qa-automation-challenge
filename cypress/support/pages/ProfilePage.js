export class ProfilePage {
  visit() { cy.visit("/profile"); }
  assertHasBook(title) {
    cy.contains("a", title, { matchCase: false, timeout: 20000 }).should("be.visible");
  }
}
