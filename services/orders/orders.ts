import fs from 'fs';
import { v4 as uuid } from 'uuid';

const getOrdersFromFile = () => JSON.parse(fs.readFileSync(orderFilePath, "utf8"));

const orderFilePath = "./services/orders/allOrders.json";
export const getAvailableQuantity = (orderList: Order[]) => orderList.reduce((total, order) => total + order.quantity, 0);
/**
 * @param  {Orders} rawOrders all orders in the raw form as defined in the Orders type
 * @param  {CurrencyPair} currencyPair 
 * @returns OrderBook
 */
export const generateOrderBookFromRawOrders = (rawOrders: Orders, currencyPair: CurrencyPair): OrderBook => {
  const allBids = sortOrders(rawOrders.buy, "buy")
    .reduce<PricedOrders>((ordersWithPrices, order) => {
      return {
        ...ordersWithPrices,
        [order.price]: ordersWithPrices[order.price] ? [...ordersWithPrices[order.price], order]: [order]
      }
    }, {});
  const allAsks = sortOrders(rawOrders.sell, "sell")
    .reduce<PricedOrders>((ordersWithPrices, order) => {
      return {
        ...ordersWithPrices,
        [order.price]: ordersWithPrices[order.price] ? [...ordersWithPrices[order.price], order]: [order]
      }
    }, {});
  
  const bids = Object.values(allBids)
    .map<OrderBookEntry>((orderList) => {
      return {
        side: "buy",
        quantity: getAvailableQuantity(orderList),
        price: orderList[0].price,
        currencyPair,
        orderCount: orderList.length
      }
    }, {});

  const asks = Object.values(allAsks)
    .map<OrderBookEntry>((orderList) => {
      return {
        side: "sell",
        quantity: getAvailableQuantity(orderList),
        price: orderList[0].price,
        currencyPair,
        orderCount: orderList.length
      }
    }, {});

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
  return generateOrderBookFromRawOrders(getOrdersFromFile() as Orders, currencyPair);
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

/**
 * @param  {LimitOrderInput} input new order that needs to be filled
 * @param  {Orders} orders full order book
 * @returns {boolean} returns true if the order can be filled (even if only partially)
 */
export const canFillOrder = ({ side, price }: LimitOrderInput, orders: Orders): boolean => {
  const oppositeSide = side === "sell" ? "buy" : "sell";
  const sortedOrders = sortOrders(orders[oppositeSide], oppositeSide);
  if(!sortedOrders.length){
    return false
  }
  if ((side === "buy" && price >= sortedOrders[0].price) || (side === "sell" && price <= sortedOrders[0].price)) {
    return true;
  }
  return false;
}

export const addToOrders = (input: LimitOrderInput, source: Orders): Orders => {
  let orders: Orders = JSON.parse(JSON.stringify(source))
  const { pair, side, price, quantity } = input;
  orders[side].push({
    side,
    quantity,
    price,
    currencyPair: pair,
    id: input.customerOrderId,
  });
  return orders;
}

export const sortOrders = (orders: Order[], side: OrderSide): Order[] => {
  return orders
    .sort((a, b) => side === "sell" ? a.price - b.price : b.price - a.price);
}

export const fillOrders = (input: LimitOrderInput, source: Orders): { trades: Trade[], resultingOrders: Orders } => {
  let allOrders = JSON.parse(JSON.stringify(source)) as Orders;
  const { side, price, quantity } = input;
  let runningQuantity = quantity;
  const oppositeSide = side === "sell" ? "buy" : "sell";
  const ordersThatFillTrade: Order[] = [];
  const sortedOrders = sortOrders(allOrders[oppositeSide], oppositeSide)

  if (side === "buy" && price >= sortedOrders[0].price) {
    // remove as many full orders as possible
    while (sortedOrders.length && price >= sortedOrders[0].price && runningQuantity - sortedOrders[0].quantity >= 0) {
      const removedOrder = sortedOrders.shift();
      ordersThatFillTrade.push({...removedOrder, price: Math.min(removedOrder.price, price) });
      runningQuantity = runningQuantity - removedOrder.quantity;
    }
  }
  if (side === "sell" && price <= sortedOrders[0].price) {
    // remove as many full orders as possible
    while (sortedOrders.length && price <= sortedOrders[0].price && runningQuantity - sortedOrders[0].quantity >= 0) {
      const removedOrder = sortedOrders.shift();
      ordersThatFillTrade.push({...removedOrder, price: Math.max(removedOrder.price, price) });
      runningQuantity = runningQuantity - removedOrder.quantity;
    }
  }

  let resultingOrders = { ...getOrdersFromFile(), [oppositeSide]: sortedOrders};
  if (runningQuantity > 0 && sortedOrders.length) {
    if ((side === "buy" && price >= sortedOrders[0].price) || (side === "sell" && price <= sortedOrders[0].price)) {
      ordersThatFillTrade.push({
        ...sortedOrders[0],
        price: side === "buy" ? Math.min(sortedOrders[0].price, price): Math.max(sortedOrders[0].price, price),
        quantity: runningQuantity,
      })
      sortedOrders[0] = {
        ...sortedOrders[0],
        quantity: sortedOrders[0].quantity - runningQuantity,
      }
    } else {
      resultingOrders = addToOrders({...input, quantity: runningQuantity}, { ...getOrdersFromFile(), [oppositeSide]: sortedOrders})
    }
  } else if (runningQuantity > 0) {
    resultingOrders = addToOrders({...input, quantity: runningQuantity}, { ...getOrdersFromFile(), [oppositeSide]: sortedOrders})
  }
  const trades = ordersThatFillTrade.map<Trade>(order => ({
    ...order,
    takerSide: oppositeSide,
    tradedAt: Date.now().toString(),
    quoteVolume: order.quantity.toString()
  }))

  return { trades, resultingOrders };
}

export const placeLimitOrder = (input: LimitOrderInput): LimitOrder => {
  const inputWithDefaults: LimitOrderInput = {
    timeInForce: "GTC",
    customerOrderId: uuid(),
    ...input
  }
  if (!limitOrderInputValid(inputWithDefaults)) {
    throw new Error("Limit order input is not valid")
  }
  const canFill = canFillOrder(input, getOrdersFromFile() as Orders);
  let finalOrders = getOrdersFromFile();
  if (!canFill) {
    finalOrders = addToOrders(inputWithDefaults, getOrdersFromFile() as Orders);
  } else {
    const {
      trades,
      resultingOrders
    } = fillOrders(input, getOrdersFromFile() as Orders);
    finalOrders = resultingOrders;
    // Prevent file overwrites when running tests
    if (process.env.NODE_ENV !== "test") {
      const oldTrades = JSON.parse(fs.readFileSync("./services/orders/allTrades.json", "utf8"));
      fs.writeFileSync("./services/orders/allTrades.json", JSON.stringify([...oldTrades as Trade[], ...trades as Trade[]].sort((t1, t2) => Number(t2.tradedAt) - Number(t1.tradedAt)), null, 2));
    }
  }
  // Prevent file overwrites when running tests
  if (process.env.NODE_ENV !== "test") {
    fs.writeFileSync("./services/orders/allOrders.json", JSON.stringify(finalOrders, null, 2));
  }
  return { id: inputWithDefaults.customerOrderId };
}

export const getRecentTrades = (): Trade[] => {
  return JSON.parse(fs.readFileSync("./services/orders/allTrades.json", "utf8")) as Trade[];
}