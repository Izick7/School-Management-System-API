const express = require("express");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const resultRoutes = require("./routes/resultRoutes");
const logger = require("./middleware/logger");

const app = express();

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "School Management API is running"
    });
});

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/results", resultRoutes);


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use(errorHandler);

module.exports = app;