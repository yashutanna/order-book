# Engineering test - Order book
## Summary 
Build a workable, in-memory order book to place a limit order and view all orders.

The api should have the following endpoints:

1. Get order book: Use this API as a reference for request and response payload, example: 
```
{
  "Asks": [
    {
      "side": "sell",
      "quantity": "0.0001",
      "price": "778780",
      "currencyPair": "BTCZAR",
      "orderCount": 1
    },
    {
      "side": "sell",
      "quantity": "0.00079014",
      "price": "779999",
      "currencyPair": "BTCZAR",
      "orderCount": 1
    }
  ],
  "Bids": [
    {
      "side": "buy",
      "quantity": "2.91125351",
      "price": "778779",
      "currencyPair": "BTCZAR",
      "orderCount": 14
    },
    {
      "side": "buy",
      "quantity": "0.0021482",
      "price": "778675",
      "currencyPair": "BTCZAR",
      "orderCount": 1
    }
  ] 
```

2. Submit limit order: This can be a very simple data structure and does not need to cater for all the advanced usages. Feel free to ask if you have any questions here. Example payloads: 

**Request**
```
{
    "side": "SELL",
    "quantity": "0.100000",
    "price": "10000",
    "pair": "BTCZAR",
    "postOnly": true,
    "customerOrderId": "1234"
    "timeInForce": "GTC"
}
```

**Response:**
```
{
    "id": "558f5e0a-ffd1-46dd-8fae-763d93fa2f25" 
}
```

3. Recent Trades: 

```
[
  {
    "price": "781000",
    "quantity": "0.00263643",
    "currencyPair": "BTCZAR",
    "tradedAt": "2021-03-08T05:54:19.924Z",
    "takerSide": "sell",
    "sequenceId": 1997578,
    "id": "cdc53e14-f770-4b38-8c23-ac11c1878cbb",
    "quoteVolume": "2059.05183"
  },
  {
    "price": "781000",
    "quantity": "0.00022081",
    "currencyPair": "BTCZAR",
    "tradedAt": "2021-03-08T05:53:48.108Z",
    "takerSide": "sell",
    "sequenceId": 1997577,
    "id": "f96461aa-1912-471e-be52-098d27ff884f",
    "quoteVolume": "172.45261"
  },
  {
    "price": "781000",
    "quantity": "0.00049221",
    "currencyPair": "BTCZAR",
    "tradedAt": "2021-03-08T05:53:12.812Z",
    "takerSide": "sell",
    "sequenceId": 1997573,
    "id": "dd211aec-b1ba-44cc-a7ae-304575ca4433",
    "quoteVolume": "384.41601"
  }
]
```

**Requirements:**

1. Unit Tests

2. NodeJS - TypeScript/JavaScript

**Notes:**

1. The orderbook design does not need to be perfectly optimised however, it will help us to gauge your understanding of research and data structures if you try to optimise it as much as possible.

2. We do not look for Fancy Code, we look for clean, clear simple code.

**Optional (bonus points) - Only consider the below after the above is complete:**

1. API Authentication

**Recommended time to complete: 6-7 Hours**

---

## Environment Information
* Operating System:          MacOS Big Sur 
* Node Version:              12.15.0
* Serverless Version:        2.28.7

---
## Getting Started

1. pull the repo to your machine
2. run `npm install`
3. run `npm run start`

run `npm run test` to run all unit tests