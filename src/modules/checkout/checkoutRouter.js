'use strict';

const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);

const User = require("../../models/user");

router.post('/create-checkout-session', async function (req, res) {
  const { cartList, wallet } = req.body;
  const lineItems = cartList.map(item => {
    return {
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.artSize.size,
          images: [item.imgUrl],
          metadata: {
            imageUrl: item.imgUrl,
            configUrl: new URL('./config.json', item.imgUrl),
          }
        },
        unit_amount: item.artSize.price * 100
      },
      quantity: item.quantity
    };
  });
  if (wallet > 0) {
    let checkWallet = await User.findOne({ where: {id : req.userId }, raw: true})
    if (checkWallet.wallet !== wallet){
      res.status(500).send("Available wallet amount mismatch");
    }
    try {
      const coupon = await stripe.coupons.create({ amount_off: wallet * 100, currency: 'aud', name: 'Use Available Credits', duration: 'once', max_redemptions: 1 });
      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
          allowed_countries: ['AU'],
        },
        client_reference_id: req.userId,
        line_items: lineItems,
        mode: 'payment',
        discounts: [{
          coupon: coupon.id,
        }],
        success_url: config.STRIPE_PAYMENT_SUCCESS_URL,
        cancel_url: config.STRIPE_PAYMENT_CANCEL_URL,
      });
      res.send({ url: session.url });
    } catch (error) {
      res.status(error.status || 500).send(error);
    }
  } else {
    try {
      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
          allowed_countries: ['AU'],
        },
        client_reference_id: req.userId,
        line_items: lineItems,
        mode: 'payment',
        success_url: config.STRIPE_PAYMENT_SUCCESS_URL,
        cancel_url: config.STRIPE_PAYMENT_CANCEL_URL,
      });
      res.send({ url: session.url });
    } catch (error) {
      res.status(error.status || 500).send(error);
    }
  }

});


module.exports = router;
