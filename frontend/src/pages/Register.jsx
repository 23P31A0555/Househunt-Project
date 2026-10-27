import { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "renter"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Registration successful!");
            navigate("/login");

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Paper elevation={4} sx={{ p: 4 }}>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ mb: 3 }}
                >
                    Create Account
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        select
                        fullWidth
                        label="Account Type"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        margin="normal"
                    >
                        <MenuItem value="renter">
                            Renter
                        </MenuItem>

                        <MenuItem value="owner">
                            Property Owner
                        </MenuItem>
                    </TextField>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                    >
                        Register
                    </Button>

                </Box>
            </Paper>
        </Container>
    );
}

export default Register;