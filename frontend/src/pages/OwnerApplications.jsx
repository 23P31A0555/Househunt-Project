import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    Chip
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

function OwnerApplications() {
    const { propertyId } = useParams();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/applications/property/${propertyId}`)
            .then((response) => response.json())
            .then((data) => {
                setApplications(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    }, [propertyId]);

    const updateStatus = async (applicationId, status) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/applications/${applicationId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to update application");
                return;
            }

            alert(`Application ${status} successfully`);

            setApplications((prev) =>
                prev.map((item) =>
                    item._id === applicationId
                        ? { ...item, status: status }
                        : item
                )
            );
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    if (loading) {
        return (
            <Container sx={{ py: 5 }}>
                <Typography>Loading applications...</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 5 }}>

            <Button
                variant="outlined"
                onClick={() => navigate("/owner-dashboard")}
                sx={{ mb: 3 }}
            >
                ← Back to Dashboard
            </Button>

            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 1 }}
            >
                Property Applications
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mb: 4 }}
            >
                Review applications submitted by renters
            </Typography>

            {applications.length === 0 ? (
                <Typography color="text.secondary">
                    No applications received yet.
                </Typography>
            ) : (
                applications.map((application) => (
                    <Card
                        key={application._id}
                        sx={{ mb: 3 }}
                    >
                        <CardContent>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                {application.renter?.name}
                            </Typography>

                            <Typography color="text.secondary">
                                📧 {application.renter?.email}
                            </Typography>

                            <Typography sx={{ mt: 2 }}>
                                🏠 {application.property?.title}
                            </Typography>

                            <Typography color="text.secondary">
                                📍 {application.property?.location}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                ₹{application.property?.rent}/month
                            </Typography>

                            <Box sx={{ mt: 2 }}>
                                <Chip
                                    label={application.status}
                                    color={
                                        application.status === "pending"
                                            ? "warning"
                                            : application.status === "approved"
                                            ? "success"
                                            : "error"
                                    }
                                />
                            </Box>

                            {application.status === "pending" && (
                                <Box
                                    sx={{
                                        mt: 3,
                                        display: "flex",
                                        gap: 2
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() =>
                                            updateStatus(
                                                application._id,
                                                "approved"
                                            )
                                        }
                                    >
                                        APPROVE
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() =>
                                            updateStatus(
                                                application._id,
                                                "rejected"
                                            )
                                        }
                                    >
                                        REJECT
                                    </Button>
                                </Box>
                            )}

                        </CardContent>
                    </Card>
                ))
            )}

        </Container>
    );
}

export default OwnerApplications;