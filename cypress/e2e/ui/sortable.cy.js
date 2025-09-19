// cypress/e2e/ui/sortable.cy.js

// Teste automatizado para ordenar a lista do Sortable em ordem crescente

// Mapeia o texto do item para seu valor numérico
const labelToNumber = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6 };

// Função para obter os textos atuais dos itens da lista
function getCurrentListOrder() {
  return cy.get('#demo-tabpane-list .list-group-item')
    .then($items => Array.from($items, el => el.textContent.trim()));
}

// Função para arrastar um item identificado pelo texto para antes do índice desejado
function moveItemToIndex(label, targetIndex) {
  const containerSelector = '#demo-tabpane-list';
  const itemSelector = `${containerSelector} .list-group-item`;

  cy.contains(itemSelector, label, { matchCase: false, timeout: 10000 }).then($source => {
    cy.get(itemSelector).eq(targetIndex).then($target => {
      const sourceRect = $source[0].getBoundingClientRect();
      const targetRect = $target[0].getBoundingClientRect();

      // Pressiona o mouse no centro do item de origem
      cy.wrap($source).trigger('mousedown', {
        button: 0,
        clientX: sourceRect.x + sourceRect.width / 2,
        clientY: sourceRect.y + sourceRect.height / 2,
        force: true,
      });

      // Move o mouse para perto do topo do alvo (para posicionar ANTES)
      cy.get('body').trigger('mousemove', {
        clientX: targetRect.x + targetRect.width / 2,
        clientY: targetRect.y + 5,
        force: true,
      });

      // Solta o mouse
      cy.get('body').trigger('mouseup', { force: true });

      cy.wait(200); // Dá tempo para o DOM atualizar a ordem
    });
  });
}

describe('Interactions • Ordenar a lista do Sortable em ordem crescente', () => {
  beforeEach(() => {
    // Bloqueia scripts de terceiros que podem travar o carregamento da página
    const thirdPartyScripts = [
      /cdn\.ad\.plus/i,
      /googletagmanager\.com/i,
      /google-analytics\.com/i,
      /doubleclick\.net/i,
      /clarity\.ms/i,
      /static\.hotjar\.com/i,
      /script\.hotjar\.com/i,
      /connect\.facebook\.net/i,
      /cdn\.segment\.com/i,
    ];
    thirdPartyScripts.forEach((pattern) => {
      cy.intercept({ method: 'GET', url: pattern }, { statusCode: 204, body: '' });
    });
  });

  it('deve abrir o Sortable, arrastar os itens e conferir que estão em ordem de 1 a 6', () => {
    // Passo 1: Acessa a página inicial e navega até Interactions
    cy.visit('https://demoqa.com/');
    cy.contains('.card-body h5', 'Interactions', { matchCase: false, timeout: 30000 })
      .scrollIntoView()
      .click();

    // Passo 2: Seleciona o submenu Sortable
    cy.contains('span', 'Sortable', { matchCase: false, timeout: 30000 }).click();
    cy.url().should('include', '/sortable');

    // Passo 3: Garante que a aba "List" está ativa e os itens estão presentes
    cy.get('#demo-tab-list').click();
    cy.get('#demo-tabpane-list .list-group-item', { timeout: 10000 })
      .should('have.length.at.least', 6);

    // Passo 4: Calcula a ordem correta (crescente)
    getCurrentListOrder().then((currentOrder) => {
      const expectedOrder = [...currentOrder].sort((a, b) => labelToNumber[a] - labelToNumber[b]);
      const workingOrder = [...currentOrder]; // Cópia para acompanhar as mudanças

      // Função recursiva para ordenar os itens
      function sortStep(index) {
        if (index >= expectedOrder.length) return;
        const desiredLabel = expectedOrder[index];
        const currentLabel = workingOrder[index];

        if (currentLabel === desiredLabel) {
          return sortStep(index + 1);
        }

        const fromIndex = workingOrder.indexOf(desiredLabel);
        if (fromIndex === -1) throw new Error(`Item "${desiredLabel}" não encontrado`);

        // Move o item desejado para a posição correta
        moveItemToIndex(desiredLabel, index);

        // Atualiza a ordem local
        workingOrder.splice(fromIndex, 1);
        workingOrder.splice(index, 0, desiredLabel);

        return sortStep(index + 1);
      }

      sortStep(0);

      // Passo 5: Valida que a ordem final está correta
      getCurrentListOrder().should((finalOrder) => {
        expect(finalOrder, 'ordem final da lista').to.deep.equal(expectedOrder);
      });
    });
  });
});
