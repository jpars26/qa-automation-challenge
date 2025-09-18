// cypress/e2e/ui/progress_bar.cy.js

// Lê o % atual direto do atributo (não depende de visibilidade)
const getProgress = () =>
  cy.get('#progressBar .progress-bar').invoke('attr', 'aria-valuenow').then(Number);

// Dá start, espera um pouquinho, e clica stop. Retorna o % atual.
const startAndStop = (waitMs) => {
  cy.get('#startStopButton').click();   // Start
  cy.wait(waitMs);
  cy.get('#startStopButton').click();   // Stop
  return getProgress();
};

describe('Widgets · Barra de Progresso — parar até 25% e resetar', () => {
  it('abre a página, para ≤25%, valida e então completa até 100% e reseta', () => {
    // 1) Home → Widgets → Progress Bar
    cy.visit('https://demoqa.com/');
    cy.contains('.card-body h5', 'Widgets', { matchCase: false, timeout: 30000 })
      .scrollIntoView()
      .click();
    cy.contains('span', 'Progress Bar', { matchCase: false, timeout: 30000 }).click();
    cy.url().should('include', '/progress-bar');

    // Elementos-chave (existem no DOM, sem exigir “visível”)
    cy.get('#startStopButton').should('be.visible');
    cy.get('#progressBar .progress-bar').should('exist');

    // Garante que começamos do zero
    getProgress().should('equal', 0);

    // 2) Tentar parar em <= 25% (com fallback de tentativas mais curtas)
    // 1ª tentativa (~180ms), se passar de 25, reset e tenta com 110ms, depois 70ms
    startAndStop(180).then((val) => {
      if (val <= 25) return val;

      cy.log(`Passou de 25% na 1ª tentativa (${val}%). Tentando de novo mais curto.`);
      cy.get('#resetButton').should('be.enabled').click();
      return startAndStop(110).then((v2) => {
        if (v2 <= 25) return v2;

        cy.log(`Ainda acima de 25% (${v2}%). Última tentativa, bem curtinha.`);
        cy.get('#resetButton').should('be.enabled').click();
        return startAndStop(70);
      });
    }).then((valFinal) => {
      expect(valFinal, 'progress depois do Stop').to.be.at.most(25);
    });

    // 3) Agora start de novo e deixar chegar a 100%
    cy.get('#startStopButton').click(); // Start novamente
    cy.get('#progressBar .progress-bar', { timeout: 25000 })
      .should(($el) => {
        const v = Number($el.attr('aria-valuenow'));
        expect(v).to.equal(100);
      })
      .and('contain.text', '100%');

    // 4) Resetar ao chegar em 100%
    cy.get('#resetButton').should('be.enabled').click();

    // Confirmar que voltou ao zero
    cy.get('#progressBar .progress-bar')
      .should('have.attr', 'aria-valuenow', '0')
      .and('contain.text', '0%');
  });
});
