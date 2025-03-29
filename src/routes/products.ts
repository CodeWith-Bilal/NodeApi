import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import authenticate from "../middleware/middleware";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { name, amount, description } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        amount: Number(amount),
        description,
      },
    });
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.get("/:id", authenticate, async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.json(product);
});

router.put("/:id", authenticate, async (req: Request, res: Response) => {
  const { name, amount, description } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { name, amount: Number(amount), description },
    });
    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
});

router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
});

export default router;
