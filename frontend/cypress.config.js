const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env = {
        ...config.env,
        BACKEND_URL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8080",
      };
      return config;
    },
    baseUrl:  process.env.REACT_APP_APP_URL || "http://localhost:3000",
    defaultCommandTimeout: 10000,
    
  },
});
