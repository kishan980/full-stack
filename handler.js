const serverless = require('serverless-http');

const expressApp = require("./src");

const handler = serverless(expressApp);

module.exports = handler