const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8765",
    setupNodeEvents(on, config) {},
  },
});
