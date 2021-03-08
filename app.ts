import express from 'express';
import serverless from 'serverless-http';
import orders from "./routes/orders";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/orders", orders);

const handler = serverless(app);

export { handler };
