// Importa os comandos customizados do Cypress
import './commands'

// Este handler ignora erros comuns de scripts de terceiros (ads, analytics, etc.)
// para evitar que falhas externas interrompam os testes da aplicação.
Cypress.on('uncaught:exception', (err) => {
  const stack = (err.stack || '').toLowerCase();
  const msg = (err.message || '').toLowerCase();

  // Verifica se o erro veio de algum script de terceiros conhecido
  const isThirdParty =
    /adplus|ad[-.]service|doubleclick|googletagmanager|google-analytics|gpt|clarity|hotjar|intercom|segment|sentry|gstatic|facebook|cdn/.test(
      stack + ' ' + msg
    );

  // Verifica se é um erro genérico de script ou de cross-origin
  const isCrossOrigin = msg.includes('script error') || msg.includes('cross origin');

  // Se for erro de terceiros ou de cross-origin, ignora e não falha o teste
  if (isThirdParty || isCrossOrigin) {
    return false;
  }

  // Para erros reais da aplicação, deixa o Cypress reportar normalmente
});
