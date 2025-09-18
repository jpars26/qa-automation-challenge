// cypress/e2e/ui/browser_windows.cy.js

describe("Frontend - Browser Windows (New Window)", () => {
  beforeEach(() => {
    // Opcional: stub de scripts de terceiros que travam o load
    const tp = [
      /cdn\.ad\.plus/i, /googletagmanager\.com/i, /google-analytics\.com/i,
      /doubleclick\.net/i, /clarity\.ms/i, /static\.hotjar\.com/i, /script\.hotjar\.com/i,
      /connect\.facebook\.net/i, /cdn\.segment\.com/i
    ];
    tp.forEach((url) => cy.intercept({ method: "GET", url }, { statusCode: 204, body: "" }));

    cy.visit("/");

  });

  it("abre nova janela, valida texto 'This is a sample page' e 'fecha' retornando", () => {
    // 1) Home → card "Alerts, Frame & Windows"
    cy.contains(".card-body h5", "Alerts, Frame & Windows", { matchCase: false, timeout: 30000 })
      .scrollIntoView()
      .click();

    // 2) Submenu "Browser Windows"
    cy.contains("span", "Browser Windows", { matchCase: false, timeout: 30000 }).click();

    // Confirma a página
    cy.url().should("include", "/browser-windows");
    cy.get("#windowButton", { timeout: 15000 }).should("be.visible");

    // 3) Stub do window.open para capturar URL (ou navegar na mesma aba)
    cy.window().then((win) => {
      // duas opções:
      // A) só capturar a URL e visitar depois:
      // cy.stub(win, "open").as("winOpen");

      // B) emular nova janela navegando na MESMA aba (mais simples):
      cy.stub(win, "open")
        .callsFake((url) => { win.location.href = url; })
        .as("winOpen");
    });

    // 4) Clicar em "New Window"
    cy.get("#windowButton").scrollIntoView().click();

    // 5) Validar que estamos na página sample, com o texto esperado
    // A página de destino é /sample e tem <h1 id="sampleHeading">This is a sample page</h1>
    cy.location("pathname", { timeout: 15000 }).should("include", "/sample");
    cy.get("#sampleHeading", { timeout: 15000 })
      .should("be.visible")
      .and("have.text", "This is a sample page");

    // 6) "Fechar a nova janela" — em Cypress, voltamos para a anterior
    cy.go("back");

    // 7) Confirmar que retornamos para /browser-windows
    cy.location("pathname", { timeout: 15000 }).should("include", "/browser-windows");
    cy.get("#windowButton").should("be.visible");
  });
});
