const express = require("express");
const Property = require("../models/Property");

const router = express.Router();

// =====================================================
// ADD PROPERTY
// =====================================================
router.post("/", async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            rent,
            bedrooms,
            images,
            owner
        } = req.body;

        const property = await Property.create({
            title,
            description,
            location,
            rent,
            bedrooms,
            images,
            owner
        });

        res.status(201).json({
            message: "Property added successfully",
            property
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to add property",
            error: error.message
        });
    }
});


// =====================================================
// GET ALL PROPERTIES
// =====================================================
router.get("/", async (req, res) => {
    try {
        const properties = await Property.find()
            .populate("owner", "name email");

        res.json(properties);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch properties",
            error: error.message
        });
    }
});


// =====================================================
// GET PROPERTIES BY OWNER
// =====================================================
router.get("/owner/:ownerId", async (req, res) => {
    try {
        const properties = await Property.find({
            owner: req.params.ownerId
        }).populate("owner", "name email");

        res.json(properties);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch owner properties",
            error: error.message
        });
    }
});


// =====================================================
// GET ONE PROPERTY
// =====================================================
router.get("/:id", async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate("owner", "name email");

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        res.json(property);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch property",
            error: error.message
        });
    }
});


// =====================================================
// DELETE PROPERTY
// =====================================================
router.delete("/:id", async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(
            req.params.id
        );

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        res.json({
            message: "Property deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete property",
            error: error.message
        });
    }
});


// =====================================================
// UPDATE PROPERTY IMAGES
// =====================================================
router.put("/:id", async (req, res) => {
    try {
        const { images } = req.body;

        // Make sure exactly 3 images are provided
        if (
            !images ||
            !Array.isArray(images) ||
            images.length !== 3
        ) {
            return res.status(400).json({
                message: "Please provide exactly 3 images"
            });
        }

        const property = await Property.findByIdAndUpdate(
            req.params.id,
            {
                images: images
            },
            {
                new: true
            }
        );

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        res.json({
            message: "Property images updated successfully",
            property
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update property images",
            error: error.message
        });
    }
});


module.exports = router;