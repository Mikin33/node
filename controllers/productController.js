const Product = require("../models/products");



exports.updateProductQuantities = async (req, res) => {
  try {
    const { products } = req.body; // Expecting an array of { id, quantity }
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid products data" });
    }

    const updatedProducts = [];
    const io = req.app.get("socketio"); // Get Socket.IO instance

    for (const item of products) {
      const { id, quantity } = item;

      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ message: `Invalid quantity for product ID ${id}` });
      }

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${id} not found` });
      }

      if (product.quantity - quantity < 0) {
        return res.status(400).json({ message: `Product with ID ${id} not in stock` });
      }

      product.quantity = product.quantity - quantity;
      await product.save();
      updatedProducts.push(product);
    }

    // Emit event to all connected clients
    io.emit("productUpdated", updatedProducts);

    return res.status(200).json({ message: "Products updated successfully", updatedProducts });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
  
