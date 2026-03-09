import Wishlist from "../models/Wishlist.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId, variantId } = req.body;
    const userId = req.userId;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: [{ productId, variantId }]
      });
      return res.json(wishlist);
    }

    const exists = wishlist.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );

    if (!exists) {
      wishlist.items.push({ productId, variantId });
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const wishlist = await Wishlist.findOne({ userId }).populate("items.productId");

    res.json(wishlist || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId = req.params.itemId;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter((item) => item._id.toString() !== itemId);

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error: error.message });
  }
};