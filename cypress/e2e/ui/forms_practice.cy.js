// cypress/e2e/ui/forms_practice.cy.js

// Teste automatizado para o formulário de prática

// Funções utilitárias para gerar dados aleatórios
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomItem(array) {
  return array[getRandomInt(array.length)];
}

function generateRandomName() {
  const firstNames = [
    "Ana", "Bruno", "Carla", "Diego", "Eva", "Fabio", "Gabi", "Henrique", "Iris", "João",
    "Karla", "Leo", "Marina", "Nina", "Otavio", "Paula", "Rafa", "Sara", "Teo", "Vivi"
  ];
  const lastNames = [
    "Silva", "Souza", "Oliveira", "Pereira", "Costa", "Santos", "Almeida", "Lima",
    "Araujo", "Mendes", "Ferraz", "Pinto", "Barros", "Moraes"
  ];
  return {
    first: getRandomItem(firstNames),
    last: getRandomItem(lastNames)
  };
}

function generateRandomEmail(first, last) {
  return `${first}.${last}.${Date.now()}@example.com`.toLowerCase();
}

function generateRandomPhone() {
  return String(9000000000 + getRandomInt(999999999));
}

describe("Frontend - Practice Form (Forms > Practice Form)", () => {
  beforeEach(() => {
    // Intercepta scripts de terceiros para evitar lentidão ou travamentos
    const thirdPartyPatterns = [
      /cdn\.ad\.plus/i, /googletagmanager\.com/i, /google-analytics\.com/i,
      /doubleclick\.net/i, /clarity\.ms/i, /static\.hotjar\.com/i, /script\.hotjar\.com/i,
      /connect\.facebook\.net/i, /cdn\.segment\.com/i
    ];
    thirdPartyPatterns.forEach((pattern) => {
      cy.intercept({ method: "GET", url: pattern }, { statusCode: 204, body: "" });
    });

    // Acessa a página inicial
    cy.visit("/");
  });

  it("deve preencher e submeter o formulário de prática, validar o popup e fechar", () => {
    // Passo 1: Navegar até o card "Forms"
    cy.contains(".card-body h5", "Forms", { matchCase: false, timeout: 30000 })
      .scrollIntoView()
      .click();

    // Passo 2: Selecionar o submenu "Practice Form"
    cy.contains("span", "Practice Form", { matchCase: false, timeout: 30000 }).click();

    // Confirma que está na página correta
    cy.url().should("include", "/automation-practice-form");

    // Passo 3: Preencher o formulário com dados aleatórios
    const { first, last } = generateRandomName();
    const email = generateRandomEmail(first, last);
    const phone = generateRandomPhone();

    cy.get("#firstName").type(first);
    cy.get("#lastName").type(last);
    cy.get("#userEmail").type(email);

    // Seleciona gênero aleatório
    cy.contains("label", getRandomItem(["Male", "Female", "Other"])).click();

    cy.get("#userNumber").type(phone);

    // Seleciona data de nascimento fixa para estabilidade do teste
    cy.get("#dateOfBirthInput").click();
    cy.get(".react-datepicker__month-select").select("May");
    cy.get(".react-datepicker__year-select").select("1995");
    cy.get(".react-datepicker__day--015:not(.react-datepicker__day--outside-month)").click();

    // Adiciona duas matérias
    cy.get("#subjectsInput").type("Maths{enter}");
    cy.get("#subjectsInput").type("English{enter}");

    // Seleciona hobbies aleatórios
    ["Sports", "Reading", "Music"].forEach(hobby => {
      if (Math.random() > 0.5) cy.contains("label", hobby).click();
    });

    // Faz upload de arquivo de exemplo
    cy.get("#uploadPicture").selectFile("cypress/fixtures/upload/sample.txt", { force: true });

    // Preenche endereço
    cy.get("#currentAddress").type("Rua das Flores, 123 - Centro");

    // Seleciona estado e cidade
    cy.get("#state").click();
    cy.get("#react-select-3-input").type("NCR{enter}");
    cy.get("#city").click();
    cy.get("#react-select-4-input").type("Delhi{enter}");

    // Passo 4: Submete o formulário
    cy.scrollTo("bottom");
    cy.contains("button", "Submit").click({ force: true });

    // Passo 5: Valida que o popup foi aberto
    cy.get(".modal-content", { timeout: 15000 }).should("be.visible");
    cy.contains("#example-modal-sizes-title-lg", "Thanks for submitting the form").should("be.visible");

    // Valida alguns dados no popup
    cy.contains("td", `${first} ${last}`).should("be.visible");
    cy.contains("td", email).should("be.visible");

    // Passo 6: Fecha o popup
    cy.get("#closeLargeModal").click();
    cy.get(".modal-content").should("not.exist");
  });
});
