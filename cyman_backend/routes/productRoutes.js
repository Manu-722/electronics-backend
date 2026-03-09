import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create product (Admin only)
router.post("/create", protect, adminOnly, createProduct);

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Update product (Admin only)
router.put("/:id", protect, adminOnly, updateProduct);

// Delete product (Admin only)
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;