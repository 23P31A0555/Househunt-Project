
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
} from "@mui/material";

function Properties() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  const location = searchParams.get("location") || "";
  const propertyType = searchParams.get("type") || "All";
  const budget = searchParams.get("budget") || "Any";

  useEffect(() => {
  setLoading(true);

  fetch("http://localhost:5000/api/properties")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      return response.json();
    })
    .then((data) => {
      setProperties(data);
      setError("");
    })
    .catch((error) => {
      console.error("Error fetching properties:", error);
      setError("Unable to load properties. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  const filteredProperties = properties.filter((property) => {
    const matchesLocation =
      location.trim() === "" ||
      property.location
        ?.toLowerCase()
        .includes(location.toLowerCase());

    const matchesType =
      propertyType === "All" ||
      Number(property.bedrooms) ===
        Number(propertyType.replace("BHK", "").trim());

    let matchesBudget = true;

    if (budget === "Under ₹10,000") {
      matchesBudget = Number(property.rent) < 10000;
    } else if (budget === "₹10,000 - ₹20,000") {
      matchesBudget =
        Number(property.rent) >= 10000 &&
        Number(property.rent) <= 20000;
    } else if (budget === "Above ₹20,000") {
      matchesBudget = Number(property.rent) > 20000;
    }

    return matchesLocation && matchesType && matchesBudget;
  });

  const clearFilters = () => {
    navigate("/properties");
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 2 }}
      >
        Available Properties
      </Typography>

      {(location || propertyType !== "All" || budget !== "Any") && (
        <Box sx={{ mb: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Showing filtered results
          </Typography>

          <Button
            variant="outlined"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Box>
      )}

      <Typography sx={{ mb: 3 }} color="text.secondary">
        {filteredProperties.length} properties found
      </Typography>
{loading && (
  <Typography sx={{ mb: 3 }}>
    Loading properties...
  </Typography>
)}

{error && (
  <Typography color="error" sx={{ mb: 3 }}>
    {error}
  </Typography>
)}
      <Grid container spacing={3}>
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
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
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={
                    property.images?.[0] ||
                    property.image ||
                    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={property.title}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80";
                  }}
                  sx={{
                    objectFit: "cover",
                  }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    {property.title}
                  </Typography>

                  <Typography color="text.secondary">
                    📍 {property.location}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    🛏️ {property.bedrooms} Bedrooms
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ mt: 1 }}
                  >
                    ₹{property.rent}/month
                  </Typography>

                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() =>
                      navigate(`/properties/${property._id}`)
                    }
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography variant="h6">
                No properties found
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Try changing your search filters.
              </Typography>

              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={clearFilters}
              >
                View All Properties
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Properties;