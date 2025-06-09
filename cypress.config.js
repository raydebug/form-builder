module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    // API tests first, then UI tests, then new feature tests
    specPattern: [
      'cypress/e2e/debug-move.cy.{js,jsx,ts,tsx}',
      'cypress/e2e/api.cy.{js,jsx,ts,tsx}',
      'cypress/e2e/form-builder.cy.{js,jsx,ts,tsx}',
      'cypress/e2e/dual-add-buttons.cy.{js,jsx,ts,tsx}',
      'cypress/e2e/move-functionality.cy.{js,jsx,ts,tsx}',
      'cypress/e2e/ui-architecture.cy.{js,jsx,ts,tsx}',
      'cypress/e2e/test-dual-buttons.cy.{js,jsx,ts,tsx}'
    ],
    fixturesFolder: 'cypress/fixtures',
    supportFile: 'cypress/support/e2e.js',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    requestTimeout: 10000,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 120000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
