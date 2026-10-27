const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Property = require("../models/Property");
const Application = require("../models/Application");

const router = express.Router();

// Admin authentication middleware
const verifyAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

// Admin dashboard statistics
router.get("/dashboard", verifyAdmin, async (req, res) => {
    try {
        const users = await User.countDocuments();
        const properties = await Property.countDocuments();
        const applications = await Application.countDocuments();

        res.json({
            users,
            properties,
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch dashboard data"
        });
    }
});

// View all users
router.get("/users", verifyAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch users"
        });
    }
});

module.exports = router;