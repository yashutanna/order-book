import allOrders from "./allOrders.json";
import fs from 'fs';
import { v4 as uuid } from 'uuid';

/**
 * @param  {Orders} rawOrders all orders in the raw form as defined in the Orders type
 * @param  {CurrencyPair} currencyPair 
 * @returns OrderBook
 */
export const generateOrderBookFromRawOrders = (rawOrders: Orders, currencyPair: CurrencyPair): OrderBook => {
  const ordersForCurrency = rawOrders[currencyPair];
  const bids = Object.values(ordersForCurrency.buyOrders)
    .map<OrderBookEntry>((orderList) => {
      return {
        side: "buy",
        quantity: orderList.reduce((total, order) => total + order.quantity, 0),
        price: orderList[0].price,
        currencyPair,
        orderCount: orderList.length
      }
    }, []);

  const asks = Object.values(ordersForCurrency.sellOrders)
    .map<OrderBookEntry>((orderList) => {
      return {
        side: "sell",
        quantity: orderList.reduce((total, order) => total + order.quantity, 0),
        price: orderList[0].price,
        currencyPair,
        orderCount: orderList.length
      }
    }, []);

  return {
    bids,
    asks
  }
}

/**
 * @param  {CurrencyPair} currencyPair pair for which to get order book. default is BTCZAR
 * @returns OrderBook 
 */
export const getOrderBook = (currencyPair: CurrencyPair = "BTCZAR"): OrderBook => {
  return generateOrderBookFromRawOrders(allOrders as Orders, currencyPair);
}

export const limitOrderInputValid = (input: LimitOrderInput): boolean => {
  if (input.price <= 0) {
    throw new Error("price must be a positive number");
  }
  if (input.quantity <= 0) {
    throw new Error("quantity must be a positive number");
  }
  return true;
}

export const placeLimitOrder = (input: LimitOrderInput): LimitOrder => {
  const inputWithDefaults: LimitOrderInput = {
    timeInForce: "GTC",
    customerOrderId: uuid(),
    ...input
  }
  const { pair, side, price, quantity } = inputWithDefaults;
  if (limitOrderInputValid(inputWithDefaults)) {
    if (allOrders[pair][side === "buy" ? "buyOrders" : "sellOrders"][price]) {
      allOrders[pair][side === "buy" ? "buyOrders" : "sellOrders"][price].push({
        side,
        quantity,
        price,
        currencyPair: pair,
        id: inputWithDefaults.customerOrderId,
      });
    } else {
      allOrders[pair][side === "buy" ? "buyOrders" : "sellOrders"][price] = [{
        side,
        quantity,
        price,
        currencyPair: pair,
        id: inputWithDefaults.customerOrderId,
      }];
    }
    // Prevent file overwrites when running tests
    if(process.env.NODE_ENV !== "test"){
      fs.writeFileSync("./services/orders/allOrders.json", JSON.stringify(allOrders, null, 2));
    }
    return { id: inputWithDefaults.customerOrderId };
  }
}

export const getRecentTrades = (): Trade[] => {
  return [];
}