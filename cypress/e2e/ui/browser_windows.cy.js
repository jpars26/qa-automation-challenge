// cypress/e2e/ui/browser_windows.cy.js

// Teste de navegação para Browser Windows

describe("Frontend - Browser Windows (Nova Janela)", () => {
  beforeEach(() => {
    // Intercepta scripts de terceiros que podem travar o carregamento da página
    const thirdPartyScripts = [
      /cdn\.ad\.plus/i, /googletagmanager\.com/i, /google-analytics\.com/i,
      /doubleclick\.net/i, /clarity\.ms/i, /static\.hotjar\.com/i, /script\.hotjar\.com/i,
      /connect\.facebook\.net/i, /cdn\.segment\.com/i
    ];
    thirdPartyScripts.forEach((pattern) => {
      cy.intercept({ method: "GET", url: pattern }, { statusCode: 204, body: "" });
    });

    // Acessa a página inicial
    cy.visit("/");
  });

  it("deve abrir uma nova janela, validar o texto e retornar para a página anterior", () => {
    // Passo 1: Clicar no card "Alerts, Frame & Windows"
    cy.contains(".card-body h5", "Alerts, Frame & Windows", { matchCase: false, timeout: 30000 })
      .scrollIntoView()
      .click();

    // Passo 2: Selecionar o submenu "Browser Windows"
    cy.contains("span", "Browser Windows", { matchCase: false, timeout: 30000 }).click();

    // Confirma que está na página correta
    cy.url().should("include", "/browser-windows");
    cy.get("#windowButton", { timeout: 15000 }).should("be.visible");

    // Passo 3: Stub do window.open para abrir na mesma aba
    cy.window().then((win) => {
      cy.stub(win, "open")
        .callsFake((url) => { win.location.href = url; })
        .as("winOpen");
    });

    // Passo 4: Clicar no botão "New Window"
    cy.get("#windowButton").scrollIntoView().click();

    // Passo 5: Validar que está na página /sample e o texto está correto
    cy.location("pathname", { timeout: 15000 }).should("include", "/sample");
    cy.get("#sampleHeading", { timeout: 15000 })
      .should("be.visible")
      .and("have.text", "This is a sample page");

    // Passo 6: Retornar para a página anterior
    cy.go("back");

    // Passo 7: Confirmar que voltou para /browser-windows
    cy.location("pathname", { timeout: 15000 }).should("include", "/browser-windows");
    cy.get("#windowButton").should("be.visible");
  });
});
