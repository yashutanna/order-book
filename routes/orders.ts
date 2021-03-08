import { Router } from 'express';
import { getOrderBook, getRecentTrades, placeLimitOrder } from '../services/orders/orders';

const orderRouter = Router();

// Get order book
orderRouter.get('/', (_, res) => res.status(200).send(getOrderBook()));

// Post limit order 
orderRouter.post('/limit', (_, res) => res.status(200).send(placeLimitOrder()));

// Get recent trades
orderRouter.get('/trades/recent', (_, res) => res.status(200).send(getRecentTrades()));

export default orderRouter;