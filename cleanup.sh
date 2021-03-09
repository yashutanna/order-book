#!/usr/bin/env bash

rm -f ./services/fees/blocks.json
rm -f ./services/orders/allTrades.json
rm -f ./services/orders/allOrders.json
echo [] >> ./services/fees/blocks.json
echo [] >> ./services/orders/allTrades.json
echo {\"buy\": [],\"sell\": []} >> ./services/orders/allOrders.json