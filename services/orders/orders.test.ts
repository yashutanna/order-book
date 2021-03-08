import { fillOrders, getAvailableQuantity, addToOrders, generateOrderBookFromRawOrders, placeLimitOrder, getRecentTrades, limitOrderInputValid, canFillOrder } from "./orders";
import testLimitOrder from "./testLimitOrder";
import allOrders from "./testOrders";

const isObject = (input: any) => typeof input === 'object' && input !== null;
const orderBook = generateOrderBookFromRawOrders(allOrders, "BTCZAR");

describe("Orders", () => {

  it("should return an Object with Bids and Asks", () => {
    expect(isObject(orderBook)).toBe(true);
    expect(Array.isArray(orderBook.asks)).toBe(true);
    expect(orderBook.bids[0].quantity).toBe(3);
    expect(orderBook.bids[0].price).toBe(100.6);
    expect(orderBook.bids[0].side).toBe("buy");
    expect(orderBook.bids[0].orderCount).toBe(1);
    expect(orderBook.bids[0].currencyPair).toBe("BTCZAR");

    expect(Array.isArray(orderBook.asks)).toBe(true);
    expect(orderBook.asks[0].quantity).toBe(1);
    expect(orderBook.asks[0].price).toBe(200.6);
    expect(orderBook.asks[0].side).toBe("sell");
    expect(orderBook.asks[0].orderCount).toBe(1);
    expect(orderBook.asks[0].currencyPair).toBe("BTCZAR");
  });

  it("should return an array for recent trades", () => {
    const recentTrades = getRecentTrades();
    expect(Array.isArray(recentTrades)).toBe(true);
  });
});

describe("Limit Orders", () => {
  it("should return an Object with an id", () => {
    const limitOrder = placeLimitOrder(testLimitOrder);
    expect(isObject(limitOrder)).toBe(true);
    expect(limitOrder.id).toBeDefined();
    expect(typeof limitOrder.id === "string").toBe(true);
  });

  it("should throw an error for negative quantity in a limit order input", () => {
    expect(() => {
      limitOrderInputValid({
        ...testLimitOrder,
        quantity: -1
      })
    }).toThrowError();
  });

  it("should throw an error for negative price in a limit order input", () => {
    expect(() => {
      limitOrderInputValid({
        ...testLimitOrder,
        price: -100
      })
    }).toThrowError();
  });

  it("should throw an error for 0 price in a limit order input", () => {
    expect(() => {
      limitOrderInputValid({
        ...testLimitOrder,
        price: 0
      })
    }).toThrowError();
  });

  it("should fill 1 order completely", () => {
    expect(allOrders.buy.length).toBe(4);
    expect(getAvailableQuantity(allOrders.buy)).toBe(10);
    const { resultingOrders, trades } = fillOrders({ ...testLimitOrder, side: "sell" }, allOrders);
    expect(getAvailableQuantity(resultingOrders.buy)).toBe(9);
    expect(trades.length).toBe(1);
  });

  it("should buy out the book", () => {
    expect(getAvailableQuantity(allOrders.buy)).toBe(10);
    const { resultingOrders, trades } = fillOrders({ ...testLimitOrder, side: "sell", price: 40, quantity: 11 }, allOrders);
    expect(getAvailableQuantity(resultingOrders.buy)).toBe(0);
    expect(getAvailableQuantity(resultingOrders.sell.filter(o => o.price == 40))).toBe(1);
    expect(trades.length).toBe(4);
  });

  it("should fill 1 order partially", () => {
    expect(allOrders.buy.length).toBe(4);
    const { resultingOrders, trades } = fillOrders({ ...testLimitOrder, side: "sell", quantity: 0.5 }, allOrders);
    expect(resultingOrders.buy.length).toBe(4);
    expect(trades.length).toBe(1);
    expect(getAvailableQuantity(resultingOrders.buy)).toBe(9.5);
    expect(resultingOrders.buy.find(o => o.price === 100.6).quantity).toBe(2.5);
  });

  it("should add the order to the back of the list for the same price", () => {
    let ordersForPrice = allOrders.buy.filter(o => o.price === 100.5);
    let availableQunaityAtPrice = getAvailableQuantity(ordersForPrice);
    expect(availableQunaityAtPrice).toBe(4);
    
    const newOrders = addToOrders(testLimitOrder, allOrders);
    ordersForPrice = newOrders.buy.filter(o => o.price === 100.5);
    availableQunaityAtPrice = getAvailableQuantity(ordersForPrice);
    expect(availableQunaityAtPrice).toBe(5);
  });

  it("should add a new order for a different price", () => {
    let ordersForPrice = allOrders.buy.filter(o => o.price === 100.7);
    let availableQunaityAtPrice = getAvailableQuantity(ordersForPrice);
    expect(availableQunaityAtPrice).toBe(0);
    
    const newOrders = addToOrders({ ...testLimitOrder, price: 100.7 }, allOrders);
    ordersForPrice = newOrders.buy.filter(o => o.price === 100.7);
    availableQunaityAtPrice = getAvailableQuantity(ordersForPrice);
    expect(availableQunaityAtPrice).toBe(1);
  });

  it("should throw an error for 0 quantity in a limit order input", () => {
    expect(() => {
      limitOrderInputValid({
        ...testLimitOrder,
        quantity: 0
      })
    }).toThrowError();
  });
  it("should not be able to fill the order", () => {
    const canFill = canFillOrder(testLimitOrder, allOrders);
    expect(canFill).toBe(false);
  });
  it("should be able to completely fill the order", () => {
    const canFill = canFillOrder({ ...testLimitOrder, side: "sell" }, allOrders);
    expect(canFill).toBe(true);
  });
  it("should be able to partially fill the order", () => {
    const canFill = canFillOrder({ ...testLimitOrder, side: "sell", quantity: 7 }, allOrders);
    expect(canFill).toBe(true);
  });
});