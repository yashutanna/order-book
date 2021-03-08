import { getOrderBook, placeLimitOrder, getRecentTrades } from "./orders";

const isObject = (input: any) => typeof input === 'object' && input !== null;

describe("Orders", () => {
  
  it("should return an Object with Bids and Asks" , () => {
    const orderBook = getOrderBook();
    expect(isObject(orderBook)).toBe(true);
    expect(Array.isArray(orderBook.asks)).toBe(true);
    expect(Array.isArray(orderBook.bids)).toBe(true);
  });

  it("should return an Objecgt with an id ", () => {
    const limitOrder = placeLimitOrder();
    expect(isObject(limitOrder)).toBe(true);
    expect(limitOrder.id).toBeDefined();
  });

  it("should return an array for recent trades", () => {
    const recentTrades = getRecentTrades();
    expect(Array.isArray(recentTrades)).toBe(true);
  });
});