import allOrders from "./allOrders";

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
  return generateOrderBookFromRawOrders(allOrders, currencyPair);
}

export const placeLimitOrder = () => {
  return { id: 1 };
}

export const getRecentTrades = (): Trade[] => {
  return [];
}