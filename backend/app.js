import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: "http://localhost:3000" , 
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true , limit: "16kb"}));
// app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import transactionRouter from "./routes/transaction.routes.js";

app.use("/users" , userRouter);
app.use("/users" , transactionRouter);

export { app };