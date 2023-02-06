'use strict';

const express = require('express');
const orderService = require("./orderService");
const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const response = await orderService.listOrdersByUserId(req.userId);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;