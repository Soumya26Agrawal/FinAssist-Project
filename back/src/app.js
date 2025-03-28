import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: 'https://finassist-project-1-dqt7.onrender.com',
  })
);

//Routes

import userRoutes from "./routes/user.route.js";
app.use("/app/v1/users/", userRoutes);

import financeRoutes from "./routes/finance.route.js";
app.use("/app/v1/finances/", financeRoutes);

export default app;
