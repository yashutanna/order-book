import express from 'express';
import serverless from 'serverless-http';
import feeRouter from './routes/fees';
import orders from "./routes/orders";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/orders", orders);
app.use("/fees", feeRouter);

const handler = serverless(app);

export { handler };
