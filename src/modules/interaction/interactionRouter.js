'use strict';

const express = require('express');

const {logger} = require('../../helpers/logger');
const interactionService = require("./interactionService");


const router = express.Router();

router.get('/', async function(req, res) {
  try {
    const response = await interactionService.listInteractions(req.userId);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post('/', async function (req, res) {
  try {
    const {type, data} = req.body;

    const interactionData = {
      userId: req.userId,
      type,
      data,
    };

    const response = await interactionService.createInteraction(interactionData);
    logger.info(response);

    res.send(response);
  } catch (error) {
    logger.error(error);
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
