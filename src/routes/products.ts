import express, { Request, Response } from "express";
import Product from "../models/products";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, amount, description } = req.body;
  const product = new Product({ name, amount, description });
  await product.save();
  res.status(201).json({ message: "Product created", product });
});

router.get("/", async (req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
});

router.get("/:id", async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.json(product);
});

router.put("/:id", async (req: Request, res: Response) => {
  const { name, amount, description } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, amount, description },
    { new: true, runValidators: true }
  );
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.json({ message: "Product updated", product });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.json({ message: "Product deleted" });
});

export default router;
