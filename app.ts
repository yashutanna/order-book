import express from 'express';
import serverless from 'serverless-http';
import hello from "./routes/hello";

const app = express();

app.use("/hello", hello);

const handler = serverless(app);

export { handler };
