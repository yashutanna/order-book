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
    id: string,
    quoteVolume: string
  }

  type OrderFillType = "FULL" | "PARTIAL" | "NONE"

  type OrderFill = {
    canBeFilled: boolean;
    fillType: OrderFillType
  }
}