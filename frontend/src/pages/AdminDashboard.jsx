import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || user.role !== "admin") {
      window.location.href = "/login";
      return;
    }

    const fetchAdminData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [statsResponse, usersResponse] = await Promise.all([
          fetch("http://localhost:5000/api/admin/dashboard", {
            headers,
          }),
          fetch("http://localhost:5000/api/admin/users", {
            headers,
          }),
        ]);

        if (!statsResponse.ok || !usersResponse.ok) {
          throw new Error("Unable to fetch admin data");
        }

        const statsData = await statsResponse.json();
        const usersData = await usersResponse.json();

        setStats(statsData);
        setUsers(usersData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAdminData();
  }, []);

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Loading admin dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Admin Dashboard
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Manage and monitor HouseHunt
      </Typography>

      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.users}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Properties
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.properties}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Applications
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.applications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="bold" mb={2}>
        Registered Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AdminDashboard;