const request = require("supertest");
const app = require("../server"); // Assuming you have an Express app instance
const { sequelize, User } = require("../models"); // Import the database connection
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset DB before running tests

  // Create a test user
  const hashedPassword = await bcrypt.hash("password123", 10);
  await User.create({
    name: "Test User",
    email: "test@example.com",
    password: hashedPassword,
    address: "Test Address",
  });

  // Generate a token for authentication
  token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: "1h" });
});

afterAll(async () => {
  await sequelize.close(); // Close DB connection after tests
});

describe("User API Tests", () => {
  test("Should register a new user", async () => {
    const response = await request(app).post("/api/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      address: "123 Main St",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body.user).toHaveProperty("email", "johndoe@example.com");
  });

  test("Should login successfully", async () => {
    const response = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("Should fetch user details", async () => {
    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toHaveProperty("email", "test@example.com");
    expect(response.body.user).not.toHaveProperty("password"); // Ensure password is excluded
  });

  test("Should return 404 for non-existent user", async () => {
    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${jwt.sign({ id: 999 }, process.env.JWT_SECRET, { expiresIn: "1h" })}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});
