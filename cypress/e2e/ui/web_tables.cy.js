// cypress/e2e/ui/web_tables.cy.js

// Teste automatizado para criar, editar e deletar registros na Web Tables

// Funções utilitárias para gerar dados aleatórios de usuário
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function chooseRandom(array) {
  return array[getRandomInt(array.length)];
}

function generateRandomUser() {
  const firstNames = [
    "Ana", "Bruno", "Carla", "Diego", "Eva", "Fabio", "Gabi", "Henrique", "Iris", "Joao",
    "Karla", "Leo", "Marina", "Nina", "Otavio", "Paula", "Rafa", "Sara", "Teo", "Vivi"
  ];
  const lastNames = [
    "Silva", "Souza", "Oliveira", "Pereira", "Costa", "Santos", "Almeida", "Lima",
    "Araujo", "Mendes", "Ferraz", "Pinto", "Barros", "Moraes"
  ];
  const firstName = chooseRandom(firstNames);
  const lastName = chooseRandom(lastNames);
  const email = `${firstName}.${lastName}.${Date.now()}@example.com`.toLowerCase();
  const age = String(20 + getRandomInt(30));
  const salary = String(3000 + getRandomInt(7000));
  const department = chooseRandom(["QA", "Dev", "Ops", "Finance", "HR", "Sales"]);

  return { firstName, lastName, email, age, salary, department };
}

describe("Elements > Web Tables - criar, editar e deletar", () => {
  it("deve criar, editar e deletar um registro", () => {
    // Passo 1: Acessa a página inicial
    cy.visit("https://demoqa.com/");

    // Passo 2: Clica no card 'Elements'
    cy.contains(".card-body h5", "Elements", { matchCase: false, timeout: 30000 })
      .scrollIntoView()
      .click();

    // Passo 3: Seleciona o submenu 'Web Tables'
    cy.contains("span", "Web Tables", { matchCase: false, timeout: 30000 }).click();
    cy.url().should("include", "/webtables");
    cy.get("#addNewRecordButton").should("be.visible");

    // Passo 4: Cria um novo registro com dados aleatórios
    const user = generateRandomUser();
    cy.get("#addNewRecordButton").click();

    cy.get("#firstName").clear().type(user.firstName);
    cy.get("#lastName").clear().type(user.lastName);
    cy.get("#userEmail").clear().type(user.email);
    cy.get("#age").clear().type(user.age);
    cy.get("#salary").clear().type(user.salary);
    cy.get("#department").clear().type(user.department);
    cy.get("#submit").click();

    // Valida que o registro foi criado
    cy.contains(".rt-td", user.email, { timeout: 15000 }).should("be.visible");

    // Passo 5: Edita o registro (altera departamento para 'QA-EDIT')
    cy.contains(".rt-td", user.email)
      .parents(".rt-tr-group")
      .first()
      .within(() => {
        cy.get('[id^="edit-record-"]').click();
      });

    cy.get("#department").clear().type("QA-EDIT");
    cy.get("#submit").click();

    // Valida que o departamento foi alterado
    cy.contains(".rt-td", user.email)
      .parents(".rt-tr-group")
      .first()
      .within(() => {
        cy.contains(".rt-td", "QA-EDIT").should("be.visible");
      });

    // Passo 6: Deleta o registro
    cy.contains(".rt-td", user.email)
      .parents(".rt-tr-group")
      .first()
      .within(() => {
        cy.get('[id^="delete-record-"]').click();
      });

    // Valida que o registro foi excluído
    cy.contains(".rt-td", user.email).should("not.exist");
  });
});
