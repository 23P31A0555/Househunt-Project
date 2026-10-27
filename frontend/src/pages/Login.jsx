import { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login successful!");

            navigate("/properties");

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
                    Login
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                    >
                        Login
                    </Button>

                </Box>
            </Paper>
        </Container>
    );
}

export default Login;