import { Router } from 'express';
import { client } from '../config/paypalConfig.js';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const router = Router();

router.post('/create-order', async (req, res) => {
    const { total } = req.body;
  
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: total.toFixed(2)
        }
      }]
    });
  
    try {
      const order = await client().execute(request);
      res.json({ id: order.result.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/capture-order', async (req, res) => {
    const { orderID } = req.body;
  
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
  
    try {
      const capture = await client().execute(request);
      res.json(capture.result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  export default router;