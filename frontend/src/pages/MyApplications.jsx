
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/applications/renter/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        return response.json();
      })
      .then((data) => {
        setApplications(data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        My Applications
      </Typography>

      {applications.length === 0 ? (
        <Typography color="text.secondary">
          You have not applied for any properties yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {applications.map((application) => {
            const property = application.property;

            return (
              <Grid item xs={12} md={6} key={application._id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    {property ? (
                      <>
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                        >
                          {property.title}
                        </Typography>

                        <Typography
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
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
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="text.secondary"
                        >
                          Property No Longer Available
                        </Typography>

                        <Typography
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          The property connected to this application
                          could not be found.
                        </Typography>
                      </>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={application.status}
                        color={
                          application.status === "approved"
                            ? "success"
                            : application.status === "rejected"
                            ? "error"
                            : "warning"
                        }
                      />
                    </Box>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Applied on:{" "}
                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default MyApplications;