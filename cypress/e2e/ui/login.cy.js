// cypress/e2e/ui/login.cy.js
import { LoginPage } from "../../support/pages/LoginPage";

describe("UI - Login do usuário criado na Parte 1", () => {
  let session;

  before(() => {
    // Garante que temos as credenciais criadas via API (session.json)
    cy.readFile("cypress/fixtures/session.json").then((data) => {
      session = data; // { userName, password, userID, token, isbns? }
      expect(session.userName, "userName").to.be.a("string");
      expect(session.password, "password").to.be.a("string");
    });
  });

  it("deve logar e ir para a página de perfil", () => {
    const login = new LoginPage();

    login.visit();
    login.fillUsername(session.userName);
    login.fillPassword(session.password);
    login.submit();

    login.assertLoggedIn(session.userName);
  });
});
