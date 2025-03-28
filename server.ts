import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authroutes from "./src/routes/auth";
import products from "./src/routes/products"

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express is available");
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database is connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
})();

app.use("/api/auth", authroutes);
app.use("/api/products", products)

app.listen(3000, () => {
  console.log("Server is Running on port 3000");
});
