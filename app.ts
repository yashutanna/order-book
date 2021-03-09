import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import feeRouter from './routes/fees';
import orders from "./routes/orders";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/orders", orders);
app.use("/fees", feeRouter);

app.listen(3000, () => {
  console.log("app started on http://localhost:3000!")
})
