'use strict';

const express = require('express');

const Cart = require('../../models/cart');
const { logger } = require('../../helpers/logger');
const cartService = require("./cartService");


const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const response = await cartService.getCarts(req.userId);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post('/', async function (req, res) {
  try {
    const { itemList, totalPrice } = req.body;
    const cartData = {
      userId: req.userId,
      itemList,
      totalPrice,
      firstReminder: null,
    };

    const currentCart = await Cart.findOne({ where: { userId: req.userId } });
    if (!currentCart || itemList !== '[]') {
      cartData.firstReminder = Date.now();
    }

    const response = await cartService.saveCart(cartData);
    logger.info(response);
    res.send(response);
  } catch (error) {
    logger.error(error);
    return res.status(error.status || 500).send(error);
  }
});

module.exports = router;
