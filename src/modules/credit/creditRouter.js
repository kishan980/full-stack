'use strict';

const express = require('express');
const lodash = require('lodash');

const creditService = require("./creditService");

const router = express.Router();

router.post('/', async function (req, res) {
  try {
    const response = await creditService.creditForReading(req);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post('/cancelPopUp', async function (req, res) {
  try {
    let response;
    if (req.body.isRead) {
      response = await creditService.blockSignUpPopUp(req);
    }
    if (req.body.isInvite) {
      response = await creditService.blockInvitePopUp(req);
    }
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.get('/', async function (req, res) {
  try {
    const response = await creditService.fetchPreferenceData(req);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post('/referral', async function (req, res) {
  try {
    const response = await creditService.sendReferral(req);

    const code = response.success ? 200 : 400;
    res.status(code).send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.get('/wallet', async function (req, res, next) {
  try {
    const response = await creditService.getWallet(req, res, next);
    
    const code = response.success ? 200 : 400;
    res.status(code).send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
