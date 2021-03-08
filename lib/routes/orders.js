import { Router } from 'express';
import { getOrderBook, getRecentTrades, placeLimitOrder } from '../services/orders/orders';
const orderRouter = Router();
orderRouter.get('/', (_, res) => res.status(200).send(getOrderBook()));
orderRouter.post('/limit', (req, res) => {
    const limitOrderInput = req.body;
    res.status(200).send(placeLimitOrder(limitOrderInput));
});
orderRouter.get('/trades/recent', (_, res) => res.status(200).send(getRecentTrades()));
export default orderRouter;
//# sourceMappingURL=orders.js.map