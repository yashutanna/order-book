export const getOrderBook = (): OrderBook => {
  return {
    asks: [],
    bids: []
  };
}

export const placeLimitOrder = () => {
  return { id: 1 };
}

export const getRecentTrades = (): Trade[] => {
  return [];
}