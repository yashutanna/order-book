import { generateOrderBookFromRawOrders, placeLimitOrder, getRecentTrades, limitOrderInputValid } from "./orders";
import testLimitOrder from "./testLimitOrder";
import allOrders from "./testOrders";

const isObject = (input: any) => typeof input === 'object' && input !== null;

describe("Orders", () => {

  it("should return an Object with Bids and Asks" , () => {

    const orderBook = generateOrderBookFromRawOrders(allOrders, "BTCZAR");
    expect(isObject(orderBook)).toBe(true);
    expect(Array.isArray(orderBook.asks)).toBe(true);
    expect(orderBook.bids[0].quantity).toBe(4);
    expect(orderBook.bids[0].price).toBe(100.5);
    expect(orderBook.bids[0].side).toBe("buy");
    expect(orderBook.bids[0].orderCount).toBe(2);
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
    expect(() => { limitOrderInputValid({
      ...testLimitOrder,
      quantity: -1
    }) }).toThrowError();
  });

  it("should throw an error for negative price in a limit order input", () => {
    expect(() => { limitOrderInputValid({
      ...testLimitOrder,
      price: -100
    }) }).toThrowError();
  });

  it("should throw an error for 0 price in a limit order input", () => {
    expect(() => { limitOrderInputValid({
      ...testLimitOrder,
      price: 0
    }) }).toThrowError();
  });

  it("should throw an error for 0 quantity in a limit order input", () => {
    expect(() => { limitOrderInputValid({
      ...testLimitOrder,
      quantity: 0
    }) }).toThrowError();
  });
});