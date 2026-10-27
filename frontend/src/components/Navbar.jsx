import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
} from "@mui/material";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #eeeeee",
                color: "#222222"
            }}
        >
            <Toolbar
                sx={{
                    px: {
                        xs: 2,
                        md: 7
                    },
                    height: 72
                }}
            >

                {/* HOUSEHUNT */}
                <Typography
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        fontSize: "1.6rem",
                        fontWeight: 700,
                        letterSpacing: "-0.5px",
                        color: "#222222",
                        mr: 6
                    }}
                >
                    House
                    <Box
                        component="span"
                        sx={{
                            color: "#1976d2"
                        }}
                    >
                        Hunt
                    </Box>
                </Typography>


                {/* CENTER NAVIGATION */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        flexGrow: 1
                    }}
                >

                    <Button
                        component={Link}
                        to="/"
                        sx={{
                            color: "#333333",
                            fontWeight: 500,
                            textTransform: "none",
                            fontSize: "0.95rem",
                            "&:hover": {
                                color: "#1976d2",
                                backgroundColor: "transparent"
                            }
                        }}
                    >
                        Home
                    </Button>

                    <Button
                        component={Link}
                        to="/properties"
                        sx={{
                            color: "#333333",
                            fontWeight: 500,
                            textTransform: "none",
                            fontSize: "0.95rem",
                            "&:hover": {
                                color: "#1976d2",
                                backgroundColor: "transparent"
                            }
                        }}
                    >
                        Properties
                    </Button>


                    {user?.role === "renter" && (
                        <Button
                            component={Link}
                            to="/my-applications"
                            sx={{
                                color: "#333333",
                                fontWeight: 500,
                                textTransform: "none",
                                fontSize: "0.95rem",
                                "&:hover": {
                                    color: "#1976d2",
                                    backgroundColor: "transparent"
                                }
                            }}
                        >
                            My Applications
                        </Button>
                    )}


                    {user?.role === "owner" && (
                        <Button
                            component={Link}
                            to="/owner-dashboard"
                            sx={{
                                color: "#333333",
                                fontWeight: 500,
                                textTransform: "none",
                                fontSize: "0.95rem",
                                "&:hover": {
                                    color: "#1976d2",
                                    backgroundColor: "transparent"
                                }
                            }}
                        >
                            Dashboard
                        </Button>
                    )}
{user?.role === "admin" && (
    <Button
        component={Link}
        to="/admin-dashboard"
        sx={{
            color: "#333333",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "0.95rem",
            "&:hover": {
                color: "#1976d2",
                backgroundColor: "transparent"
            }
        }}
    >
        Admin Dashboard
    </Button>
)}
                </Box>


                {/* RIGHT SIDE */}
                {!user ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }}
                    >

                        <Button
                            component={Link}
                            to="/login"
                            sx={{
                                color: "#333333",
                                fontWeight: 500,
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "transparent",
                                    color: "#1976d2"
                                }
                            }}
                        >
                            Login
                        </Button>

                        <Button
                            component={Link}
                            to="/register"
                            variant="contained"
                            sx={{
                                textTransform: "none",
                                borderRadius: "25px",
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                boxShadow: "none"
                            }}
                        >
                            Get Started
                        </Button>

                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }}
                    >

                        <Typography
                            sx={{
                                fontSize: "0.95rem",
                                color: "#555555",
                                display: {
                                    xs: "none",
                                    md: "block"
                                }
                            }}
                        >
                            Hi, {user.name}
                        </Typography>

                        <Button
                            onClick={handleLogout}
                            sx={{
                                color: "#333333",
                                fontWeight: 500,
                                textTransform: "none",
                                "&:hover": {
                                    color: "#d32f2f",
                                    backgroundColor: "transparent"
                                }
                            }}
                        >
                            Logout
                        </Button>

                    </Box>
                )}

            </Toolbar>
        </AppBar>
    );
}

export default Navbar;