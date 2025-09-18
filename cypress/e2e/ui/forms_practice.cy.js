// cypress/e2e/ui/forms_practice.cy.js

// Geradores simples de dados
function rand(max) { return Math.floor(Math.random() * max); }
function randChoice(arr){ return arr[rand(arr.length)]; }
function randName() {
  const first = ["Ana","Bruno","Carla","Diego","Eva","Fabio","Gabi","Henrique","Iris","João","Karla","Leo","Marina","Nina","Otavio","Paula","Rafa","Sara","Teo","Vivi"];
  const last  = ["Silva","Souza","Oliveira","Pereira","Costa","Santos","Almeida","Lima","Araujo","Mendes","Ferraz","Pinto","Barros","Moraes"];
  return { first: randChoice(first), last: randChoice(last) };
}
function randEmail(f,l){ return `${f}.${l}.${Date.now()}@example.com`.toLowerCase(); }
function randPhone(){ return String(9000000000 + rand(999999999)); } // 10 dígitos

describe("Frontend - Practice Form (Forms > Practice Form)", () => {
  beforeEach(() => {
    // Stubs para scripts de terceiros que atrapalham o load
    const tp = [
      /cdn\.ad\.plus/i, /googletagmanager\.com/i, /google-analytics\.com/i,
      /doubleclick\.net/i, /clarity\.ms/i, /static\.hotjar\.com/i, /script\.hotjar\.com/i,
      /connect\.facebook\.net/i, /cdn\.segment\.com/i
    ];
    tp.forEach((url) => cy.intercept({ method: "GET", url }, { statusCode: 204, body: "" }));

    cy.visit("/");
   
  });

  it("deve preencher e submeter o Practice Form, abrir e fechar o popup", () => {
    // 1) Home -> clicar no card "Forms"
    cy.contains(".card-body h5", "Forms", { matchCase: false, timeout: 30000 })
      .scrollIntoView()
      .click();

    // 2) Na página de Forms -> submenu "Practice Form"
    cy.contains("span", "Practice Form", { matchCase: false, timeout: 30000 }).click();

    // Garante que estamos na Practice Form
    cy.url().should("include", "/automation-practice-form");

    // 3) Preencher o formulário
    const { first, last } = randName();
    const email = randEmail(first, last);
    const phone = randPhone();

    cy.get("#firstName").type(first);
    cy.get("#lastName").type(last);
    cy.get("#userEmail").type(email);

    // Gender (clica no label, não no input escondido)
    cy.contains("label", randChoice(["Male","Female","Other"])).click();

    cy.get("#userNumber").type(phone);

    // Data de Nascimento: abre o datepicker e escolhe uma data fixa (mais estável)
    cy.get("#dateOfBirthInput").click();
    cy.get(".react-datepicker__month-select").select("May");    // Maio
    cy.get(".react-datepicker__year-select").select("1995");
    cy.get(".react-datepicker__day--015:not(.react-datepicker__day--outside-month)").click();

    // Subjects (autocomplete): adiciona 2
    cy.get("#subjectsInput").type("Maths{enter}");
    cy.get("#subjectsInput").type("English{enter}");

    // Hobbies
    ["Sports","Reading","Music"].forEach(h => {
      if (Math.random() > 0.5) cy.contains("label", h).click();
    });

    // Upload de arquivo .txt da pasta fixtures
    cy.get("#uploadPicture").selectFile("cypress/fixtures/upload/sample.txt", { force: true });

    // Endereço
    cy.get("#currentAddress").type("Rua das Flores, 123 - Centro");

    // State & City (react-select): usar input interno
    cy.get("#state").click();
    cy.get("#react-select-3-input").type("NCR{enter}");

    cy.get("#city").click();
    cy.get("#react-select-4-input").type("Delhi{enter}");

    // 4) Submeter
    cy.scrollTo("bottom");
    cy.contains("button", "Submit").click({ force: true });

    // 5) Garantir popup aberto
    cy.get(".modal-content", { timeout: 15000 }).should("be.visible");
    cy.contains("#example-modal-sizes-title-lg", "Thanks for submitting the form").should("be.visible");

    // (opcional) validar alguns campos renderizados na tabela
    cy.contains("td", `${first} ${last}`).should("be.visible");
    cy.contains("td", email).should("be.visible");

    // 6) Fechar popup
    cy.get("#closeLargeModal").click();
    cy.get(".modal-content").should("not.exist");
  });
});
