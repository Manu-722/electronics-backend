import Product from "../models/Product.js";
import cloudinary from "cloudinary";

// CLOUDINARY CONFIG
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, description, basePrice, gender, variants } = req.body;

    let parsedVariants = [];

    if (typeof variants === "string") {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (err) {
        return res.status(400).json({ message: "Invalid variants format" });
      }
    } else {
      parsedVariants = variants;
    }

    // UPLOAD IMAGE TO CLOUDINARY (FIXED)
    let imageUrl = "";
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { folder: "cyman_products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const newProduct = await Product.create({
      name,
      description,
      basePrice,
      gender,
      variants: parsedVariants,
      image: imageUrl,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { name, description, basePrice, gender, variants } = req.body;

    let parsedVariants = [];

    if (typeof variants === "string") {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (err) {
        return res.status(400).json({ message: "Invalid variants format" });
      }
    } else {
      parsedVariants = variants;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        basePrice,
        gender,
        variants: parsedVariants,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};