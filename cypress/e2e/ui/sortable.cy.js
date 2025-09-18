// cypress/e2e/ui/sortable.cy.js

// mapeia texto -> número para sabermos a ordem correta
const labelToNum = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6 };

// lê os textos atuais da lista
const getListTexts = () =>
  cy.get('#demo-tabpane-list .list-group-item')
    .then($els => [...$els].map(el => el.textContent.trim()));

// arrasta o item com "label" para ficar ANTES do índice targetIndex
const dragLabelToIndex = (label, targetIndex) => {
  const container = '#demo-tabpane-list';
  const itemSel = `${container} .list-group-item`;

  cy.contains(itemSel, label, { matchCase: false, timeout: 10000 }).then($src => {
    cy.get(itemSel).eq(targetIndex).then($tgt => {
      const src = $src[0].getBoundingClientRect();
      const tgt = $tgt[0].getBoundingClientRect();

      // mousedown no centro do item origem
      cy.wrap($src).trigger('mousedown', {
        button: 0,
        clientX: src.x + src.width / 2,
        clientY: src.y + src.height / 2,
        force: true,
      });

      // mousemove para perto do topo do alvo (para posicionar ANTES)
      cy.get('body').trigger('mousemove', {
        clientX: tgt.x + tgt.width / 2,
        clientY: tgt.y + 5,
        force: true,
      });

      // soltar
      cy.get('body').trigger('mouseup', { force: true });

      cy.wait(200); // pequena folga para o DOM reordenar
    });
  });
};

describe('Interactions • ordenar a lista do Sortable em ordem crescente', () => {
  beforeEach(() => {
    // BLOQUEIA scripts de terceiros que travam o load da home
    const thirdParty = [
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
    thirdParty.forEach((url) => {
      cy.intercept({ method: 'GET', url }, { statusCode: 204, body: '' });
    });
  });

  it('abre o Sortable, arrasta itens e confere que ficou 1→6', () => {
    // 1) Home → Interactions
    cy.visit('https://demoqa.com/');
    cy.contains('.card-body h5', 'Interactions', { matchCase: false, timeout: 30000 })
      .scrollIntoView()
      .click();

    // 2) Submenu Sortable
    cy.contains('span', 'Sortable', { matchCase: false, timeout: 30000 }).click();
    cy.url().should('include', '/sortable');

    // 3) Aba "List" e itens presentes
    cy.get('#demo-tab-list').click();
    cy.get('#demo-tabpane-list .list-group-item', { timeout: 10000 })
      .should('have.length.at.least', 6);

    // 4) calcula a ordem alvo (crescente por número)
    getListTexts().then((curOrder) => {
      const targetOrder = [...curOrder].sort((a, b) => labelToNum[a] - labelToNum[b]);
      const work = [...curOrder]; // cópia mutável para acompanhar as mudanças

      const step = (i) => {
        if (i >= targetOrder.length) return;
        const want = targetOrder[i];
        const has = work[i];

        if (has === want) {
          return step(i + 1);
        }

        const fromIndex = work.indexOf(want);
        if (fromIndex === -1) throw new Error(`Item "${want}" não encontrado`);

        // arrasta o 'want' para a posição i
        dragLabelToIndex(want, i);

        // atualiza a ordem local
        work.splice(fromIndex, 1);
        work.splice(i, 0, want);

        return step(i + 1);
      };

      step(0);

      // 5) validação final
      getListTexts().should((finalOrder) => {
        expect(finalOrder, 'ordem final').to.deep.equal(targetOrder);
      });
    });
  });
});
