const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } =
  require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } =
  require("@badeball/cypress-cucumber-preprocessor/esbuild"); // <- pegue a função nomeada

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://demoqa.com",
    specPattern: "cypress/e2e/**/*.{cy.js,feature}",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)], // <- agora é função mesmo
        })
      );
      return config;
    },
  },
  chromeWebSecurity: false,
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 120000,
  viewportWidth: 1366,
  viewportHeight: 768,
});
