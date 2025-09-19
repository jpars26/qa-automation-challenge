// cypress/e2e/ui/progress_bar.cy.js

// Teste automatizado para Progress Bar — parar antes de 25% e resetar

// Função para ler o valor atual da barra de progresso
function getProgressValue() {
  return cy.get('#progressBar .progress-bar')
    .invoke('attr', 'aria-valuenow')
    .then(Number);
}

// Função para iniciar, esperar um tempo e parar a barra, retornando o valor atual
function startProgressAndStop(waitMs) {
  cy.get('#startStopButton').click(); // Inicia
  cy.wait(waitMs);
  cy.get('#startStopButton').click(); // Para
  return getProgressValue();
}

describe('Widgets · Progress Bar - parar antes de 25% e resetar', () => {
  it('deve abrir a página, parar ≤25%, validar, completar até 100% e resetar', () => {
    // Navega até Progress Bar
    cy.visit('https://demoqa.com/');
    cy.contains('.card-body h5', 'Widgets', { matchCase: false, timeout: 30000 })
      .scrollIntoView()
      .click();
    cy.contains('span', 'Progress Bar', { matchCase: false, timeout: 30000 }).click();
    cy.url().should('include', '/progress-bar');

    // Confirma que os elementos principais estão presentes
    cy.get('#startStopButton').should('be.visible');
    cy.get('#progressBar .progress-bar').should('exist');

    // Garante que a barra começa em zero
    getProgressValue().should('equal', 0);

    // Tenta parar a barra antes de 25% (faz até 3 tentativas com tempos diferentes)
    startProgressAndStop(180).then((progress) => {
      if (progress <= 25) {
        expect(progress, 'progresso deve ser ≤25%').to.be.at.most(25);
        return progress;
      }

      cy.log(`Passou de 25% na 1ª tentativa (${progress}%). Tentando novamente com tempo menor.`);
      cy.get('#resetButton').should('be.enabled').click();
      return startProgressAndStop(110).then((progress2) => {
        if (progress2 <= 25) {
          expect(progress2, 'progresso deve ser ≤25%').to.be.at.most(25);
          return progress2;
        }

        cy.log(`Ainda acima de 25% (${progress2}%). Última tentativa com tempo mínimo.`);
        cy.get('#resetButton').should('be.enabled').click();
        return startProgressAndStop(70).then((progress3) => {
          expect(progress3, 'progresso deve ser ≤25%').to.be.at.most(25);
          return progress3;
        });
      });
    });

    // Inicia novamente e espera até 100%
    cy.get('#startStopButton').click();
    cy.get('#progressBar .progress-bar', { timeout: 25000 })
      .should(($el) => {
        const value = Number($el.attr('aria-valuenow'));
        expect(value).to.equal(100);
      })
      .and('contain.text', '100%');

    // Reseta a barra
    cy.get('#resetButton').should('be.enabled').click();

    // Confirma que voltou ao zero
    cy.get('#progressBar .progress-bar')
      .should('have.attr', 'aria-valuenow', '0')
      .and('contain.text', '0%');
  });
});
