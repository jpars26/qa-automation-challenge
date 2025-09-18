// cypress/e2e/ui/web_tables.cy.js

function rand(n) { return Math.floor(Math.random() * n); }
function pick(a) { return a[rand(a.length)]; }
function randomUser() {
  const firsts = ["Ana","Bruno","Carla","Diego","Eva","Fabio","Gabi","Henrique","Iris","Joao","Karla","Leo","Marina","Nina","Otavio","Paula","Rafa","Sara","Teo","Vivi"];
  const lasts  = ["Silva","Souza","Oliveira","Pereira","Costa","Santos","Almeida","Lima","Araujo","Mendes","Ferraz","Pinto","Barros","Moraes"];
  const f = pick(firsts), l = pick(lasts);
  return {
    firstName: f,
    lastName: l,
    email: `${f}.${l}.${Date.now()}@example.com`.toLowerCase(),
    age: String(20 + rand(30)),
    salary: String(3000 + rand(7000)),
    department: pick(["QA","Dev","Ops","Finance","HR","Sales"])
  };
}

describe("Elements > Web Tables - criar, editar e deletar", () => {
  it("deve criar, editar e deletar um registro", () => {
    // 1) Home
    cy.visit("https://demoqa.com/");

    // 2) Card 'Elements'
    cy.contains(".card-body h5", "Elements", { matchCase: false, timeout: 30000 })
      .scrollIntoView()
      .click();

    // 3) Submenu 'Web Tables'
    cy.contains("span", "Web Tables", { matchCase: false, timeout: 30000 }).click();
    cy.url().should("include", "/webtables");
    cy.get("#addNewRecordButton").should("be.visible");

    // 4) Criar novo registro
    const u = randomUser();
    cy.get("#addNewRecordButton").click();

    cy.get("#firstName").clear().type(u.firstName);
    cy.get("#lastName").clear().type(u.lastName);
    cy.get("#userEmail").clear().type(u.email);
    cy.get("#age").clear().type(u.age);
    cy.get("#salary").clear().type(u.salary);
    cy.get("#department").clear().type(u.department);
    cy.get("#submit").click();

    // Validar que a linha com o email apareceu
    cy.contains(".rt-td", u.email, { timeout: 15000 }).should("be.visible");

    // 5) Editar o registro (trocar departamento para 'QA-EDIT')
    cy.contains(".rt-td", u.email)
      .parents(".rt-tr-group")
      .first()
      .within(() => {
        cy.get('[id^="edit-record-"]').click();
      });

    cy.get("#department").clear().type("QA-EDIT");
    cy.get("#submit").click();

    // validar edição
    cy.contains(".rt-td", u.email)
      .parents(".rt-tr-group")
      .first()
      .within(() => {
        cy.contains(".rt-td", "QA-EDIT").should("be.visible");
      });

    // 6) Deletar o registro
    cy.contains(".rt-td", u.email)
      .parents(".rt-tr-group")
      .first()
      .within(() => {
        cy.get('[id^="delete-record-"]').click();
      });

    // validar exclusão
    cy.contains(".rt-td", u.email).should("not.exist");
  });
});
