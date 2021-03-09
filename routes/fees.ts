import { Router } from 'express';
import { getAverageGweiForBlocksFile, initWebSocket } from '../services/fees/fees';

initWebSocket();

const feeRouter = Router();

feeRouter.get<{last: number}>('/estimate', async (req, res) => {
  const { last = 0 } = req.params;
  res.status(200).send({ averageGwei: getAverageGweiForBlocksFile("./services/fees/blocks.json", last)});
});

export default feeRouter;