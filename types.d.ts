export {};

declare global {
  type CurrencyPair = "BTCZAR" | "ETHZAR" | "XRPZAR";
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

  type Orders = {
    [price in CurrencyPair]: {
      buyOrders: {
        [amount: string]: Order[]
      }
      sellOrders: {
        [amount: string]: Order[]
      }
    }
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
    sequenceId: 1997578,
    id: string,
    quoteVolume: string
  }
}