import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

//Routes

import userRoutes from "./routes/user.route.js";
app.use("/app/v1/users/", userRoutes);

import financeRoutes from "./routes/finance.route.js";
app.use("/app/v1/finances/", financeRoutes);

export default app;
