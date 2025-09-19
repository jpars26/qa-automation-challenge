const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// Função para gerar um número aleatório até n
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Função para escolher um item aleatório de um array
function chooseRandom(array) {
  return array[getRandomInt(array.length)];
}

// Função para criar um usuário aleatório
function generateRandomUser() {
  const firstNames = [
    "Ana", "Bruno", "Carla", "Diego", "Eva", "Fabio", "Gabi", "Henrique",
    "Iris", "Joao", "Karla", "Leo", "Marina", "Nina", "Otavio", "Paula",
    "Rafa", "Sara", "Teo", "Vivi"
  ];
  const lastNames = [
    "Silva", "Souza", "Oliveira", "Pereira", "Costa", "Santos", "Almeida",
    "Lima", "Araujo", "Mendes", "Ferraz", "Pinto", "Barros", "Moraes"
  ];
  const firstName = chooseRandom(firstNames);
  const lastName = chooseRandom(lastNames);
  const email = `${firstName}.${lastName}.${Date.now()}_${Math.random().toString(36).slice(2,7)}@example.com`.toLowerCase();
  const age = String(20 + getRandomInt(30));
  const salary = String(3000 + getRandomInt(7000));
  const department = chooseRandom(["QA", "Dev", "Ops", "Finance", "HR", "Sales"]);

  return { firstName, lastName, email, age, salary, department };
}

// Passo para acessar a página de Web Tables
Given("que estou na página Web Tables", () => {
  cy.visit("/");
  cy.contains(".card-body h5", "Elements", { matchCase: false, timeout: 30000 })
    .scrollIntoView()
    .click();
  cy.contains("span", "Web Tables", { matchCase: false, timeout: 30000 }).click();
  cy.url().should("include", "/webtables");
  cy.get("#addNewRecordButton").should("be.visible");
});

// Passo para criar múltiplos registros aleatórios
When("eu crio {int} registros aleatórios", (quantity) => {
  const createdEmails = [];
  for (let i = 0; i < quantity; i++) {
    const user = generateRandomUser();
    createdEmails.push(user.email);

    cy.get("#addNewRecordButton").click();
    cy.get("#firstName").clear().type(user.firstName);
    cy.get("#lastName").clear().type(user.lastName);
    cy.get("#userEmail").clear().type(user.email);
    cy.get("#age").clear().type(user.age);
    cy.get("#salary").clear().type(user.salary);
    cy.get("#department").clear().type(user.department);
    cy.get("#submit").click();

    // Confirma que o registro foi criado usando a busca
    cy.get("#searchBox").clear().type(user.email);
    cy.contains(".rt-td", user.email, { timeout: 15000 }).should("be.visible");
    cy.get("#searchBox").clear();
  }
  cy.wrap(createdEmails).as("createdEmails");
});

// Passo para verificar se todos os registros criados aparecem na tabela
Then("devo ver cada um criado na tabela", () => {
  cy.get("@createdEmails").then((emails) => {
    emails.forEach((email) => {
      cy.get("#searchBox").clear().type(email);
      cy.contains(".rt-td", email, { timeout: 15000 }).should("be.visible");
      cy.get("#searchBox").clear();
    });
  });
});

// Passo para deletar todos os registros criados
When("eu deleto todos os registros criados", () => {
  cy.get("@createdEmails").then((emails) => {
    emails.forEach((email) => {
      cy.get("#searchBox").clear().type(email);
      cy.get('[id^="delete-record-"]').first().click();
      cy.contains(".rt-td", email).should("not.exist");
      cy.get("#searchBox").clear();
    });
  });
});

// Passo para garantir que nenhum dos registros criados permaneceu
Then("nenhum dos registros criados deve permanecer", () => {
  cy.get("@createdEmails").then((emails) => {
    emails.forEach((email) => {
      cy.get("#searchBox").clear().type(email);
      cy.contains(".rt-td", email).should("not.exist");
      cy.get("#searchBox").clear();
    });
  });
});
