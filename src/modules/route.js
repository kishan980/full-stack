'use strict';
const { Router } = require('express');
const { verifyAuthToken } = require('../middlewares/auth');
const { verifyEmail } = require('../middlewares/verifyEmail');
const userRoute = require('./user/userRouter');
const imageRoute = require('./image/imageRouter');
const orderRoute = require('./order/orderRouter');
const cartRoute = require('./cart/cartRouter');
const checkoutRoute = require('./checkout/checkoutRouter');
const webhookRoute = require('./webhook/webhookRouter');
const interactionRoute = require('./interaction/interactionRouter')
const creditRoute = require('./credit/creditRouter');
const utilityRoute = require('./utility/utilityRouter');

const router = Router();

const init = () => {
  // *** register routes here *** //
  router.use('/users', userRoute);
  router.use('/images', verifyAuthToken, verifyEmail, imageRoute);
  router.use('/orders', verifyAuthToken, verifyEmail, orderRoute);
  router.use('/carts', verifyAuthToken, verifyEmail, cartRoute);
  router.use('/interactions', verifyAuthToken, verifyEmail, interactionRoute);
  router.use('/checkout', verifyAuthToken, verifyEmail, checkoutRoute);
  router.use('/webhook', webhookRoute);
  router.use('/credit', verifyAuthToken, verifyEmail, creditRoute);
  router.use('/utility', utilityRoute);

  return router;
};

module.exports = {init};
