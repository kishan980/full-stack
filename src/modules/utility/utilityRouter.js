'use strict';

const express = require('express');

const utilityService = require("./utilityService");


const router = express.Router();

router.get('/delete-shalin', async (req, res) => {
  try {
    const response = await utilityService.deleteShalin();
    const code = response.success ? 200 : 400;

    res.status(code).send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
