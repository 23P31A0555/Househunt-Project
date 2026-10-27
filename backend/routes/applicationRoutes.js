const express = require("express");
const Application = require("../models/Application");
const Property = require("../models/Property");

const router = express.Router();

// Apply for a property
router.post("/", async (req, res) => {
    try {
        const { propertyId, renterId } = req.body;

        if (!propertyId || !renterId) {
            return res.status(400).json({
                message: "Property ID and renter ID are required"
            });
        }

        const existingApplication = await Application.findOne({
            property: propertyId,
            renter: renterId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this property"
            });
        }

        const application = await Application.create({
            property: propertyId,
            renter: renterId
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Application failed",
            error: error.message
        });
    }
});


// Get applications of a renter
router.get("/renter/:renterId", async (req, res) => {
    try {
        const applications = await Application.find({
            renter: req.params.renterId
        })
            .populate("property")
            .populate("renter", "name email");

        res.json(applications);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch applications",
            error: error.message
        });
    }
});


// Get applications for a property owner
router.get("/property/:propertyId", async (req, res) => {
    try {
        const property = await Property.findById(req.params.propertyId);

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        const applications = await Application.find({
            property: req.params.propertyId
        })
            .populate("renter", "name email")
            .populate("property", "title location rent");

        res.json(applications);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch applications",
            error: error.message
        });
    }
});
// Approve or reject an application
router.put("/:applicationId/status", async (req, res) => {
    try {
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.applicationId,
            { status },
            { new: true }
        )
        .populate("renter", "name email")
        .populate("property", "title location rent");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: `Application ${status} successfully`,
            application
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update application",
            error: error.message
        });
    }
});
module.exports = router;