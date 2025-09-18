
// Import commands.js using ES2015 syntax:
import './commands'
// cypress/support/e2e.js

// Ignore apenas erros de scripts de terceiros comuns (ads, analytics, etc.)
Cypress.on('uncaught:exception', (err) => {
  const stack = (err.stack || '').toLowerCase();
  const msg = (err.message || '').toLowerCase();

  const isThirdParty =
    /adplus|ad[-.]service|doubleclick|googletagmanager|google-analytics|gpt|clarity|hotjar|intercom|segment|sentry|gstatic|facebook|cdn/.test(
      stack + ' ' + msg
    );
  // Ignora erros de terceiros (ads/analytics) para não quebrar o teste
Cypress.on('uncaught:exception', (err) => {
  const s = ((err && err.stack) || '' + (err && err.message) || '').toLowerCase();
  if (/adplus|googletagmanager|google-analytics|doubleclick|clarity|hotjar|segment|script error|cross origin/.test(s)) {
    return false;
  }
});

// Remove banners/rodapé que às vezes cobrem o botão Submit
Cypress.Commands.add('cleanOverlays', () => {
  cy.get('body').then(($b) => {
    $b.find('#fixedban, footer').remove();
  });
});
  // "Script error" genérico do navegador
  // também cobre mensagens genéricas de cross-origin
  const isCrossOrigin = msg.includes('script error') || msg.includes('cross origin');

  if (isThirdParty || isCrossOrigin) {
    return false; // não falha o teste por erro do app de terceiro
  }

  // deixe falhar para erros reais da aplicação sob teste
});
