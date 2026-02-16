// Load environment variables first
require('dotenv').config();

// Import the Express app
let app;
try {
  const appModule = require("../dist/src/app.js");
  app = appModule.default || appModule;
} catch (error) {
  console.error("Failed to load app:", error);
  throw error;
}

// Export the Express app as a serverless function
module.exports = app;
