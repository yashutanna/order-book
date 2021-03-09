import { Router } from 'express';
import { BigNumber, ethers } from "ethers";

const provider = ethers.getDefaultProvider("rinkeby", {
    infura: {
      projectId: process.env.INFURE_PROJECT_ID,
      projectSecret: process.env.INFURE_PROJECT_SECRET,
    },
    etherscan: process.env.ETHERSCAN_API_KEY
});

const feeRouter = Router();

// Get order book
feeRouter.get<{last: number}>('/estimate', async (req, res) => {
  const { last = 0 } = req.params;
  const blocks: ethers.providers.Block[] = [];
  const lastBlock = await provider.getBlock(await provider.getBlockNumber());
  blocks.push(lastBlock);
  let counter = last;
  let currentBlock = lastBlock;
  while(counter > 0){
    currentBlock = await provider.getBlock(currentBlock.parentHash);
    blocks.push(currentBlock);
    counter--;
  }
  const totalGwei = blocks.reduce((total, block) => block.gasUsed.add(total), BigNumber.from(0))
  const gwei = totalGwei.div(BigNumber.from(blocks.length)).toNumber();
  res.status(200).send({ gwei: gwei});
  
});

export default feeRouter;

// https://rinkeby.infura.io/v3/219beeed7e3a4752bcc8ba32cbc25d0c

// wss://rinkeby.infura.io/ws/v3/219beeed7e3a4752bcc8ba32cbc25d0c