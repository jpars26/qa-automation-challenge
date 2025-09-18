// cypress/e2e/api/token_authorize.cy.js
describe("API - Gerar token e checar autorização", () => {
  let account = null;

  before(() => {
    // Lê dados salvos no passo anterior
    cy.readFile("cypress/fixtures/session.json").then((data) => {
      account = data; // { userName, password, userID }
    });
  });

  it("deve gerar um token válido para o usuário criado", () => {
    cy.then(() => {
      expect(account?.userName, "userName carregado").to.be.a("string");
      expect(account?.password, "password carregado").to.be.a("string");
    });

    cy.request("POST", "/Account/v1/GenerateToken", {
      userName: account.userName,
      password: account.password,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("status", "Success");
      expect(res.body).to.have.property("token");

      // Persistir token para próximos passos
      const token = res.body.token;
      cy.readFile("cypress/fixtures/session.json").then((prev) => {
        cy.writeFile("cypress/fixtures/session.json", {
          ...prev,
          token,
        });
      });
    });
  });

  it("deve retornar autorizado = true para o usuário criado", () => {
    cy.request("POST", "/Account/v1/Authorized", {
      userName: account.userName,
      password: account.password,
    }).then((res) => {
      expect(res.status).to.eq(200);
      // A API retorna boolean no body (true/false)
      expect(res.body).to.eq(true);
    });
  });
});
