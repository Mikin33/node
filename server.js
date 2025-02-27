const express = require("express");
const http = require("http"); // Import HTTP module
const { Server } = require("socket.io"); // Import Socket.IO
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const webRoutes = require("./routes/website");

require("dotenv").config();

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Change this to your frontend domain in production
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());

app.use("/", webRoutes);
app.use("/api/auth", authRoutes);

// Handle 404 errors (Route not found)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Custom Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      timestamp: Date.now(),
    },
  });
});

// Store active sockets
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make `io` accessible in routes
app.set("socketio", io);

const PORT = process.env.PORT || 4000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Use `server.listen`
  })
  .catch((err) => console.log("DB Connection Error:", err));
