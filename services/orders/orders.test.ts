import { generateOrderBookFromRawOrders, placeLimitOrder, getRecentTrades } from "./orders";
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

  it("should return an Object with an id ", () => {
    const limitOrder = placeLimitOrder();
    expect(isObject(limitOrder)).toBe(true);
    expect(limitOrder.id).toBeDefined();
  });

  it("should return an array for recent trades", () => {
    const recentTrades = getRecentTrades();
    expect(Array.isArray(recentTrades)).toBe(true);
  });
});