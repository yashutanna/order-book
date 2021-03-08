export {};

declare global {
  type CurrencyPair = "BTCZAR";
  type OrderSide = "sell" | "buy";

  interface OrderBookEntry {
    side: OrderSide,
    quantity: number,
    price: number,
    currencyPair: CurrencyPair,
    orderCount: number
  }

  type OrderBook = {
    asks: OrderBookEntry[],
    bids: OrderBookEntry[],
  }

  type NewOrderInput = {
    side: OrderSide,
    quantity: number,
    price: number,
    pair: CurrencyPair,
    postOnly: boolean,
    customerOrderId: string,
    timeInForce: "GTC" | "FOK" | "IOC"
  }

  interface Order extends OrderBookEntry{
    id: string
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