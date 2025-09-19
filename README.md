# QA Automation Challenge

![Cypress](https://img.shields.io/badge/Cypress-15.2.0-17202C?logo=cypress)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Automated-2088FF?logo=github-actions&logoColor=white)
![Cucumber](https://img.shields.io/badge/CucumberJS-Enabled-23D96C?logo=cucumber&logoColor=white)

Este projeto contém automações de testes UI e API utilizando [Cypress](https://www.cypress.io/).  
O objetivo é validar funcionalidades do site [DemoQA](https://demoqa.com/) e garantir a qualidade das principais features.

No primeiro teste de API apenas o ultimo item de teste que nao foi implementado pois mesmo entrando pelo link nao tem autorização
- Listar os detalhes do usuário com os livros escolhidos 

Os acessos são registrados no arquivo:
- cypress\fixtures\session.json

## Estrutura do Projeto

```
cypress/
  e2e/
    ui/         # Testes de interface (UI)
    api/        # Testes de API
  fixtures/     # Dados de apoio (ex: session.json)
  support/      # Comandos customizados e configurações
.github/
  workflows/    # Workflows de automação (CI)
```

## Pré-requisitos

- Node.js (>= 18)
- npm (>= 9)
- Git

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/jpars26/qa-automation-challenge.git

   cd qa-automation-challenge
   ```

2. Instale as dependências:
   ```
   npm install
   ```

## Como rodar os testes

### Testes UI (interface)

- Para rodar todos os testes UI em modo headless:
  ```
  npx cypress run --e2e
  ```
- Para abrir o Cypress em modo interativo:
  ```
  npx cypress open
  ```

### Testes API

- Os testes de API estão em `cypress/e2e/api/`.  
  Eles podem ser rodados junto com os testes UI ou individualmente:
  ```
  npx cypress run --spec "cypress/e2e/api/*.cy.js"
  ```

## Integração Contínua (CI)

O projeto possui workflow automatizado via GitHub Actions.  
A cada push ou pull request, os testes são executados automaticamente.  
Artefatos de falha (screenshots, vídeos) são salvos para consulta.

## Configurações importantes

- Os testes ignoram erros de scripts de terceiros para evitar falsos negativos.
- Dados dinâmicos são gerados automaticamente para evitar conflitos.
- O arquivo `cypress/fixtures/session.json` é usado para armazenar dados temporários (ex: ISBNs).

## Dicas:

- Todos os testes estão comentados e organizados por funcionalidade.
- Para rodar localmente, basta seguir os passos de instalação e execução acima.
- Os resultados dos testes podem ser visualizados no terminal ou na interface do Cypress.
- Em caso de dúvidas, consulte os comentários nos arquivos de teste.
- Se for testar na versao --spec pode ser que alguns testes nao passem
- Os testes passam se abrir o cypress e vizualizar pela interface

## Duvidas

 - Estou a disposição para qual quer duvida!

