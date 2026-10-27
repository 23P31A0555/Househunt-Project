
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    rent: "",
    bedrooms: "",
    images: ["", "", ""],
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          rent: data.rent || "",
          bedrooms: data.bedrooms || "",
          images: [
            data.images?.[0] || "",
            data.images?.[1] || "",
            data.images?.[2] || "",
          ],
        });
      })
      .catch(() => alert("Unable to load property"));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...form.images];
    updatedImages[index] = value;
    setForm({ ...form, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/properties/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            rent: Number(form.rent),
            bedrooms: Number(form.bedrooms),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      alert("Property updated successfully!");
      navigate("/owner-dashboard");
    } catch (error) {
      alert("Unable to update property");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Edit Property
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            required
          />

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Rent"
            name="rent"
            type="number"
            value={form.rent}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Bedrooms"
            name="bedrooms"
            type="number"
            value={form.bedrooms}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Typography variant="h6" sx={{ mt: 3 }}>
            Property Images
          </Typography>

          {form.images.map((image, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Image ${index + 1} URL`}
              value={image}
              onChange={(e) =>
                handleImageChange(index, e.target.value)
              }
              margin="normal"
              required
            />
          ))}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            Save Changes
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate("/owner-dashboard")}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditProperty;