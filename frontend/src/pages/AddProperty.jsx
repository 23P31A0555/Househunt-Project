import { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddProperty() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        rent: "",
        bedrooms: "",
        images: ["", "", ""]
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (index, value) => {
        const updatedImages = [...form.images];

        updatedImages[index] = value;

        setForm({
            ...form,
            images: updatedImages
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Make sure all 3 images are provided
        if (form.images.some((image) => image.trim() === "")) {
            alert("Please provide all 3 image URLs");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/properties",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: form.title,
                        description: form.description,
                        location: form.location,
                        rent: Number(form.rent),
                        bedrooms: Number(form.bedrooms),
                        images: form.images,
                        owner: user.id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to add property");
                return;
            }

            alert("Property added successfully!");

            navigate("/owner-dashboard");

        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 5 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 4 }}
            >
                Add Property
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}
            >

                <TextField
                    label="Property Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <TextField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    required
                />

                <TextField
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                />

                <TextField
                    label="Monthly Rent"
                    name="rent"
                    type="number"
                    value={form.rent}
                    onChange={handleChange}
                    required
                />

                <TextField
                    label="Number of Bedrooms"
                    name="bedrooms"
                    type="number"
                    value={form.bedrooms}
                    onChange={handleChange}
                    required
                />

                <Typography
                    variant="h6"
                    sx={{ mt: 2 }}
                >
                    Property Images
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Add 3 image URLs for this property.
                </Typography>

                {form.images.map((image, index) => (
                    <TextField
                        key={index}
                        label={`Image ${index + 1} URL`}
                        value={image}
                        onChange={(e) =>
                            handleImageChange(index, e.target.value)
                        }
                        required
                    />
                ))}

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                >
                    Add Property
                </Button>

            </Box>

        </Container>
    );
}

export default AddProperty;