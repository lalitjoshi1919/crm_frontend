require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");
const tokensRouter = require("./src/routers/tokens.router");
const handleError = require("./src/utils/errorHandler");

const app = express();
const port = process.env.PORT || 3001;

// Security
app.use(helmet());

// CORS
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("tiny"));
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/tokens", tokensRouter);

// 404 handler
app.use((req, res, next) => {
  const error = new Error("Resource not found!");
  error.status = 404;
  next(error);
});

// Global error handler
app.use((error, req, res, next) => handleError(error, res));

// Start server
app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
});
