const express = require("express");
const { getUserDetails } = require("../controllers/authController");
const { listProducts, updateProductQuantities } = require("../controllers/productController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/products", authenticateToken, listProducts);

router.post("/update-products-quantity", authenticateToken, updateProductQuantities);

router.get("/user-details", authenticateToken, getUserDetails);

module.exports = router;
