import allOrders from "./allOrders.json";
import fs from 'fs';
import { v4 as uuid } from 'uuid';
export const getAvailableQuantity = (orderList) => orderList.reduce((total, order) => total + order.quantity, 0);
export const generateOrderBookFromRawOrders = (rawOrders, currencyPair) => {
    const allBids = sortOrders(rawOrders.buy, "buy")
        .reduce((ordersWithPrices, order) => {
        return Object.assign(Object.assign({}, ordersWithPrices), { [order.price]: ordersWithPrices[order.price] ? [...ordersWithPrices[order.price], order] : [order] });
    }, {});
    const allAsks = sortOrders(rawOrders.sell, "sell")
        .reduce((ordersWithPrices, order) => {
        return Object.assign(Object.assign({}, ordersWithPrices), { [order.price]: ordersWithPrices[order.price] ? [...ordersWithPrices[order.price], order] : [order] });
    }, {});
    const bids = Object.values(allBids)
        .map((orderList) => {
        return {
            side: "buy",
            quantity: getAvailableQuantity(orderList),
            price: orderList[0].price,
            currencyPair,
            orderCount: orderList.length
        };
    }, {});
    const asks = Object.values(allAsks)
        .map((orderList) => {
        return {
            side: "sell",
            quantity: getAvailableQuantity(orderList),
            price: orderList[0].price,
            currencyPair,
            orderCount: orderList.length
        };
    }, {});
    return {
        bids,
        asks
    };
};
export const getOrderBook = (currencyPair = "BTCZAR") => {
    return generateOrderBookFromRawOrders(allOrders, currencyPair);
};
export const limitOrderInputValid = (input) => {
    if (input.price <= 0) {
        throw new Error("price must be a positive number");
    }
    if (input.quantity <= 0) {
        throw new Error("quantity must be a positive number");
    }
    return true;
};
export const canFillOrder = ({ side, price }, orders) => {
    const oppositeSide = side === "sell" ? "buy" : "sell";
    const sortedOrders = sortOrders(orders[oppositeSide], oppositeSide);
    if (!sortedOrders.length) {
        return false;
    }
    if ((side === "buy" && price >= sortedOrders[0].price) || (side === "sell" && price <= sortedOrders[0].price)) {
        return true;
    }
    return false;
};
export const addToOrders = (input, source) => {
    let orders = JSON.parse(JSON.stringify(source));
    const { pair, side, price, quantity } = input;
    orders[side].push({
        side,
        quantity,
        price,
        currencyPair: pair,
        id: input.customerOrderId,
    });
    return orders;
};
export const sortOrders = (orders, side) => {
    return orders
        .sort((a, b) => side === "sell" ? a.price - b.price : b.price - a.price);
};
export const fillOrders = (input, source) => {
    let allOrders = JSON.parse(JSON.stringify(source));
    const { side, price, quantity } = input;
    let runningQuantity = quantity;
    const oppositeSide = side === "sell" ? "buy" : "sell";
    const ordersThatFillTrade = [];
    const sortedOrders = sortOrders(allOrders[oppositeSide], oppositeSide);
    if (side === "buy" && price >= sortedOrders[0].price) {
        while (sortedOrders.length && price >= sortedOrders[0].price && runningQuantity - sortedOrders[0].quantity >= 0) {
            const removedOrder = sortedOrders.shift();
            ordersThatFillTrade.push(removedOrder);
            runningQuantity = runningQuantity - removedOrder.quantity;
        }
    }
    if (side === "sell" && price <= sortedOrders[0].price) {
        while (sortedOrders.length && price <= sortedOrders[0].price && runningQuantity - sortedOrders[0].quantity >= 0) {
            const removedOrder = sortedOrders.shift();
            ordersThatFillTrade.push(removedOrder);
            runningQuantity = runningQuantity - removedOrder.quantity;
        }
    }
    let resultingOrders = Object.assign(Object.assign({}, allOrders), { [oppositeSide]: sortedOrders });
    if (runningQuantity > 0 && sortedOrders.length) {
        if ((side === "buy" && price >= sortedOrders[0].price) || (side === "sell" && price <= sortedOrders[0].price)) {
            ordersThatFillTrade.push(Object.assign(Object.assign({}, sortedOrders[0]), { quantity: runningQuantity }));
            sortedOrders[0] = Object.assign(Object.assign({}, sortedOrders[0]), { quantity: sortedOrders[0].quantity - runningQuantity });
        }
    }
    else {
        resultingOrders = addToOrders(Object.assign(Object.assign({}, input), { quantity: runningQuantity }), Object.assign(Object.assign({}, allOrders), { [oppositeSide]: sortedOrders }));
    }
    const trades = ordersThatFillTrade.map(order => (Object.assign(Object.assign({}, order), { takerSide: oppositeSide, tradedAt: Date.now().toString(), quoteVolume: order.quantity.toString() })));
    return { trades, resultingOrders };
};
export const placeLimitOrder = (input) => {
    const inputWithDefaults = Object.assign({ timeInForce: "GTC", customerOrderId: uuid() }, input);
    if (!limitOrderInputValid(inputWithDefaults)) {
        throw new Error("Limit order input is not valid");
    }
    const canFill = canFillOrder(input, allOrders);
    let finalOrders = allOrders;
    if (!canFill) {
        finalOrders = addToOrders(inputWithDefaults, allOrders);
    }
    else {
        const { trades, resultingOrders } = fillOrders(input, allOrders);
        finalOrders = resultingOrders;
        if (process.env.NODE_ENV !== "test") {
            fs.writeFileSync("./services/orders/allTrades.json", JSON.stringify(trades, null, 2));
        }
    }
    if (process.env.NODE_ENV !== "test") {
        fs.writeFileSync("./services/orders/allOrders.json", JSON.stringify(finalOrders, null, 2));
    }
    return { id: inputWithDefaults.customerOrderId };
};
export const getRecentTrades = () => {
    return [];
};
//# sourceMappingURL=orders.js.map