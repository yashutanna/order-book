import { BigNumber } from "ethers"
import WebSocket from 'ws';
import fs from 'fs';

let ws: WebSocket;

export const initWebSocket = () => {  
  if(!process.env.INFURA_PROJECT_ID){
    console.warn("INFURA_PROJECT_ID has not been set in .env file. Please refere to README.md for more info");
  }
  ws = new WebSocket(`wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`);
  ws.on("open", () => {
    ws.send('{"jsonrpc":"2.0","method":"eth_subscribe","params":["newHeads"], "id":1}');
  });
  
  ws.on('message', function incoming(data) {
    var message = JSON.parse(data.toString("utf8")) as InfuraBlockResponse;
    console.log(JSON.stringify(message, null, 2));
    if(message.method === "eth_subscription"){
      if (process.env.NODE_ENV !== "test") {
        const blocks = JSON.parse(fs.readFileSync("./services/fees/blocks.json", "utf8"));
        fs.writeFileSync("./services/fees/blocks.json", JSON.stringify([...blocks, message], null, 2));
      }
    }
  });
}

export const getAverageGweiForBlocksFile = (file: string, last: number = 0) => {
  const blocks = JSON.parse(fs.readFileSync(file, "utf8")) as InfuraBlockResponse[];
  if(!blocks.length){
    return 0;
  }
  const blocksToConsider = last === 0 ? blocks : sortBlocks(blocks).splice(0, last);
  const totalGas = getTotalGwei(blocksToConsider);
  return totalGas.div(BigNumber.from(blocksToConsider.length)).toNumber();
}

export const getTotalGwei = (blocks: InfuraBlockResponse[]) => blocks
  .reduce((total, block) => total.add(BigNumber.from(block.params.result.gasUsed)), BigNumber.from(0))

export const sortBlocks = (blocks: InfuraBlockResponse[]) => blocks
  .sort((block1, block2) => Number(block2.params.result.timestamp) - Number(block1.params.result.timestamp));