'use strict';
const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const endpointSecret = config.STRIPE_ENDPOINT_SECRET

const webhookService = require("./webhookService");

const fulfillOrder = (session) => {
  // TODO: fill me in
  console.log("Fulfilling order", session);
}

const createOrder = async (session, createdAt) => {
  try {
    console.log('---session--->',session,"<------session-------")

    const orderData = {
      userId: session.client_reference_id,
      email: session.customer_details.email,
      paymentId: session.payment_intent,
      sessionId: session.id,
      orderDate: createdAt,
      status: session.payment_status,
      shipping: JSON.stringify(session.shipping),
      totalPrice: session.amount_total,
      discount: session.total_details.amount_discount
    }
    console.log('----orderData-->',orderData,"<----orderData------")
    await webhookService.createOrder(orderData);
  } catch (error) {
    console.log(error)
  }
}

const emailCustomerAboutFailedPayment = (session) => {
  console.log("Emailing customer", session);
}


router.post('/stripe',  express.raw({type: 'application/json'}), (request, response) =>{

  const payload = request.body;
  const sig = request.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret); //live web hook
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const createdAt = event.created;
      // Save an order in your database, marked as 'awaiting payment'
      createOrder(session, createdAt);
      if (session.payment_status === 'paid') {
        fulfillOrder(session);
      }
      break;
    }
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object;
      fulfillOrder(session);
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object;

      // Send an email to the customer asking them to retry their order
      emailCustomerAboutFailedPayment(session);

      break;
    }
  }
  response.send();
});

router.get('/lineitems', async function (req, res) {
  // const {sessionId} = req.body;
  const sessionId =  req.query.sessionId || req.body.sessionId;
  try {
    stripe.checkout.sessions.listLineItems(
      sessionId,
      function(err, lineItems) {
        res.send(lineItems);
      }
    );
    
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});
module.exports = router;
