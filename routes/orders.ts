import { Router } from 'express';
import { getOrderBook, getRecentTrades, placeLimitOrder } from '../services/orders/orders';

const orderRouter = Router();

// Get order book
orderRouter.get('/', (_, res) => res.status(200).send(getOrderBook()));

// Post limit order 
orderRouter.post<{}, {}, LimitOrderInput>(
  '/limit',
  // TODO - Yashu: Add validation using something like https://express-validator.github.io/docs/index.html
  (req, res) => {
    const limitOrderInput = req.body;
    res.status(200).send(placeLimitOrder(limitOrderInput));
  }
);

// Get recent trades
orderRouter.get('/trades/recent', (_, res) => res.status(200).send(getRecentTrades()));

export default orderRouter;