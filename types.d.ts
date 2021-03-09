export {};

declare global {
  type CurrencyPair = "BTCZAR";
  type OrderSide = "sell" | "buy";

  interface OrderBookEntry {
    orderCount: number
    side: OrderSide,
    quantity: number,
    price: number,
    currencyPair: CurrencyPair,
  }

  type OrderBook = {
    asks: OrderBookEntry[],
    bids: OrderBookEntry[],
  }

  type LimitOrderInput = {
    side: OrderSide,
    quantity: number,
    price: number,
    pair: CurrencyPair,
    postOnly: boolean,
    customerOrderId: string,
    timeInForce: "GTC" | "FOK" | "IOC"
  }

  interface Order {
    side: OrderSide,
    quantity: number,
    price: number,
    currencyPair: CurrencyPair,
    id: string
  }

  type PricedOrders = {
    [amount: string]: Order[]
  }

  type Orders = {
    buy: Order[]
    sell: Order[]
  }

  interface LimitOrder {
    id: string;
  }

  interface Trade {
    price: number,
    quantity: number,
    currencyPair: CurrencyPair,
    takerSide: OrderSide,
    tradedAt: string,
    quoteVolume: string
  }

  type OrderFillType = "FULL" | "PARTIAL" | "NONE"

  type OrderFill = {
    canBeFilled: boolean;
    fillType: OrderFillType
  }

  type InfuraBlockResponse = {
    jsonrpc: string;
    method: string;
    params: {
      subscription: string;
      result: {
        number: string;
        hash: string;
        parentHash: string;
        sha3Uncles: string;
        logsBloom: string;
        transactionsRoot: string;
        stateRoot: string;
        receiptsRoot: string;
        miner: string;
        difficulty: string;
        extraData: string;
        gasLimit: string;
        gasUsed: string;
        timestamp: string;
        nonce: string;
        mixHash: string;
      }
    }
  }
}