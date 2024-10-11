import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
config();

import authRoute from "./src/routes/auth.js";
import postRoute from "./src/routes/posts.js";
import { verifyToken } from "./src/middleware/jwt.js";

const app = express();
app.use(cookieParser());
app.use(helmet());

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome go to this end point to login '/api/auth/login'",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/post", verifyToken, postRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
