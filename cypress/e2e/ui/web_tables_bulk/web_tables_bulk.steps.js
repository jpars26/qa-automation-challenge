const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

function rand(n) { return Math.floor(Math.random() * n); }
function pick(a) { return a[rand(a.length)]; }
function randomUser() {
  const firsts = ["Ana","Bruno","Carla","Diego","Eva","Fabio","Gabi","Henrique","Iris","Joao","Karla","Leo","Marina","Nina","Otavio","Paula","Rafa","Sara","Teo","Vivi"];
  const lasts  = ["Silva","Souza","Oliveira","Pereira","Costa","Santos","Almeida","Lima","Araujo","Mendes","Ferraz","Pinto","Barros","Moraes"];
  const f = pick(firsts), l = pick(lasts);
  return {
    firstName: f,
    lastName: l,
    email: `${f}.${l}.${Date.now()}_${Math.random().toString(36).slice(2,7)}@example.com`.toLowerCase(),
    age: String(20 + rand(30)),
    salary: String(3000 + rand(7000)),
    department: pick(["QA","Dev","Ops","Finance","HR","Sales"])
  };
}

Given("que estou na página Web Tables", () => {
  cy.visit("/");
  cy.contains(".card-body h5", "Elements", { matchCase: false, timeout: 30000 })
    .scrollIntoView()
    .click();
  cy.contains("span", "Web Tables", { matchCase: false, timeout: 30000 }).click();
  cy.url().should("include", "/webtables");
  cy.get("#addNewRecordButton").should("be.visible");
});

When("eu crio {int} registros aleatórios", (n) => {
  const emails = [];
  for (let i = 0; i < n; i++) {
    const u = randomUser();
    emails.push(u.email);

    cy.get("#addNewRecordButton").click();
    cy.get("#firstName").clear().type(u.firstName);
    cy.get("#lastName").clear().type(u.lastName);
    cy.get("#userEmail").clear().type(u.email);
    cy.get("#age").clear().type(u.age);
    cy.get("#salary").clear().type(u.salary);
    cy.get("#department").clear().type(u.department);
    cy.get("#submit").click();

    // Confirma criação (usando busca para evitar paginação)
    cy.get("#searchBox").clear().type(u.email);
    cy.contains(".rt-td", u.email, { timeout: 15000 }).should("be.visible");
    cy.get("#searchBox").clear();
  }
  cy.wrap(emails).as("createdEmails");
});

Then("devo ver cada um criado na tabela", () => {
  cy.get("@createdEmails").then((emails) => {
    emails.forEach((email) => {
      cy.get("#searchBox").clear().type(email);
      cy.contains(".rt-td", email, { timeout: 15000 }).should("be.visible");
      cy.get("#searchBox").clear();
    });
  });
});

When("eu deleto todos os registros criados", () => {
  cy.get("@createdEmails").then((emails) => {
    emails.forEach((email) => {
      cy.get("#searchBox").clear().type(email);
      // clica no delete do registro filtrado
      cy.get('[id^="delete-record-"]').first().click();
      // confirma que sumiu
      cy.contains(".rt-td", email).should("not.exist");
      cy.get("#searchBox").clear();
    });
  });
});

Then("nenhum dos registros criados deve permanecer", () => {
  cy.get("@createdEmails").then((emails) => {
    emails.forEach((email) => {
      cy.get("#searchBox").clear().type(email);
      cy.contains(".rt-td", email).should("not.exist");
      cy.get("#searchBox").clear();
    });
  });
});
