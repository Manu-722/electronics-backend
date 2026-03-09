import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, basePrice, gender, variants } = req.body;

    const parsedVariants = JSON.parse(variants);

    const newProduct = await Product.create({
      name,
      description,
      basePrice,
      gender,
      variants: parsedVariants
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};