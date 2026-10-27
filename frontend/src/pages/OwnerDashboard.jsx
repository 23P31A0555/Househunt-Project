
import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id;

    useEffect(() => {
        if (!user || user.role !== "owner") {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:5000/api/properties/owner/${user.id}`)
            .then((response) => response.json())
            .then((data) => {
                setProperties(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [navigate, userId]);

    return (
        <Container sx={{ py: 5 }}>

            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Owner Dashboard
                    </Typography>

                    <Typography color="text.secondary">
                        Welcome, {user?.name}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    onClick={() => navigate("/add-property")}
                >
                    + Add Property
                </Button>
            </Box>

            {/* My Properties */}
            <Typography
                variant="h5"
                sx={{ mb: 3 }}
            >
                My Properties
            </Typography>

            {properties.length === 0 ? (

                <Typography color="text.secondary">
                    You haven't added any properties yet.
                </Typography>

            ) : (

                <Grid container spacing={3}>

                    {properties.map((property) => (

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={property._id}
                        >

                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >

                                {/* Property Image */}
                                <Box
                                    component="img"
                                    src={
                                        property.images &&
                                        property.images.length > 0
                                            ? property.images[0]
                                            : property.image
                                    }
                                    alt={property.title}
                                    sx={{
                                        width: "100%",
                                        height: 220,
                                        objectFit: "cover"
                                    }}
                                />

                                <CardContent
                                    sx={{
                                        flexGrow: 1
                                    }}
                                >

                                    {/* Title */}
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{ mb: 1 }}
                                    >
                                        {property.title}
                                    </Typography>

                                    {/* Location */}
                                    <Typography
                                        color="text.secondary"
                                    >
                                        📍 {property.location}
                                    </Typography>

                                    {/* Bedrooms */}
                                    <Typography sx={{ mt: 1 }}>
                                        🛏️ {property.bedrooms} Bedrooms
                                    </Typography>

                                    {/* Rent */}
                                    <Typography
                                        variant="h6"
                                        sx={{ mt: 1 }}
                                    >
                                        ₹{property.rent}/month
                                    </Typography>

                                    {/* View Applications Button */}
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        onClick={() =>
                                            navigate(
                                                `/owner/applications/${property._id}`
                                            )
                                        }
                                    >
                                        View Applications
                                    </Button>

                                    {/* Edit Property Button */}
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        onClick={() =>
                                            navigate(
                                                `/edit-property/${property._id}`
                                            )
                                        }
                                    >
                                        Edit Property
                                    </Button>

                                </CardContent>

                            </Card>

                        </Grid>

                    ))}

                </Grid>

            )}

        </Container>
    );
}

export default OwnerDashboard;