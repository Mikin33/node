const express = require("express");
const { register, login, getUserDetails } = require("../controllers/authController");
const { listProducts } = require("../controllers/productController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/products", authenticateToken, listProducts);

// Add the new route
router.get("/user-details", authenticateToken, getUserDetails);

module.exports = router;
