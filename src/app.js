const express = require("express");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const studentRoutes = require("./routes/studentRoutes");


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "School Management API is running"
    });
});

app.use("/api/students", studentRoutes);

app.use("/api/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use(errorHandler);

module.exports = app;