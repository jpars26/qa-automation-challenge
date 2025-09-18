// cypress/e2e/api/create_user.cy.js
import { uniqueEmail } from "../../support/utils";

describe("API - Criar usuário", () => {
  it("deve criar um usuário válido e salvar userID para próximos passos", () => {
    const userName = uniqueEmail("demoqa");
    const password = "Strong!Passw0rd1"; // regra de senha forte

    cy.request("POST", "/Account/v1/User", {
      userName,
      password,
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("userID");
      const userID = res.body.userID;

      // Guardar para a sessão atual (arquivo para outros specs)
      cy.writeFile("cypress/fixtures/session.json", {
        userName,
        password,
        userID,
      });

      cy.log(`userID: ${userID} | userName: ${userName}`);
    });
  });
});
