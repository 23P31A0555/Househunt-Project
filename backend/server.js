const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/applications", applicationRoutes);
app.get("/", (req, res) => {
    res.send("HouseHunt Backend is Running!");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });