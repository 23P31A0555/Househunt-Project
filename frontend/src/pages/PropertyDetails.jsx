import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Container,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
    CircularProgress
} from "@mui/material";

function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:5000/api/properties/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setProperty(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    }, [id]);

    const handleApply = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        if (user.role !== "renter") {
            alert("Only renters can apply for properties");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/applications",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        propertyId: id,
                        renterId: user.id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Application failed");
                return;
            }

            alert("Application submitted successfully!");

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 8
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!property) {
        return (
            <Container sx={{ py: 5 }}>
                <Typography variant="h5">
                    Property not found
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 5 }}>
            <Card>

                {/* Main Property Image */}
                <CardMedia
                    component="img"
                    height="400"
                    image={
                        property.images?.[selectedImage] ||
                        property.image
                    }
                    alt={property.title}
                    sx={{
                        objectFit: "cover"
                    }}
                />

                {/* Image Thumbnails */}
                {property.images && property.images.length > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2,
                            px: 2,
                            overflowX: "auto"
                        }}
                    >
                        {property.images.map((image, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={image}
                                alt={`${property.title} ${index + 1}`}
                                onClick={() =>
                                    setSelectedImage(index)
                                }
                                sx={{
                                    width: 110,
                                    height: 75,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    border:
                                        selectedImage === index
                                            ? "3px solid"
                                            : "1px solid #ddd"
                                }}
                            />
                        ))}
                    </Box>
                )}

                <CardContent sx={{ p: 4 }}>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                    >
                        {property.title}
                    </Typography>

                    <Typography
                        variant="h6"
                        color="text.secondary"
                    >
                        📍 {property.location}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        🛏️ {property.bedrooms} Bedrooms
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{ mt: 2 }}
                    >
                        ₹{property.rent}/month
                    </Typography>

                    <Typography sx={{ mt: 3 }}>
                        {property.description}
                    </Typography>

                    {property.owner && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">
                                Property Owner
                            </Typography>

                            <Typography>
                                {property.owner.name}
                            </Typography>

                            <Typography color="text.secondary">
                                {property.owner.email}
                            </Typography>
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        sx={{ mt: 4 }}
                        onClick={handleApply}
                    >
                        Apply Now
                    </Button>

                </CardContent>
            </Card>
        </Container>
    );
}

export default PropertyDetails;