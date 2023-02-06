'use strict';
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const routerConfig = require('./modules/route');
const config = require('./config/config');
const { logger } = require('./helpers/logger');
const sequelize = require('./models/index')
const job = require('./cron/cron')

const init = () => {
  // *** express instance *** //
  const app = express();
  // Configuraing the standard middlewares.
  setupStandardMiddlewares(app);
  configureApiEndpoints(app);
  configureErrorHandler(app);
  //start cron job 
  job.checkInviteValidity.start();
  job.myCollectionReminder.start();
  job.unusedCreditReminder.start();
  job.abandonedCartReminder.start();
  app.listen(config.SERVER_PORT);
  console.log(`Listening on port ${config.SERVER_PORT} in ${config.NODE_ENV} mode`);
  logger.info(`Listening on port ${config.SERVER_PORT} in ${config.NODE_ENV} mode`);
};

const setupStandardMiddlewares = (app) => {
  // parse requests of content-type - application/json
  // app.use(bodyParser.json());

  app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/webhook/stripe') {
      next();
    } else {
      bodyParser.json()(req, res, next);
    }
  });
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  return;
};

const configureApiEndpoints = (app) => {
  //creates tables if it does not exist in database
  sequelize.sync();
  app.use("/api/v1/", routerConfig.init());
  // define a route handler for the default home page
  app.get("/", (req, res) => {
    res.send("Welcome to express-create application!");
  });
};

const configureErrorHandler = (app) => {
  app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 400;
    // if (err.message == "jwt expired" || err.message == "Authentication error") { res.status(401).send({ statusCode: 401, message: err }) }
    if (err.Error) res.status(status).send({ statusCode: status, success: false, message: err.Error });
    else if (err.message) res.status(status).send({ statusCode: status, success: false, message: err.message });
    else res.status(status).send({ statusCode: status, success: false, message: err });
  });
}

init();
