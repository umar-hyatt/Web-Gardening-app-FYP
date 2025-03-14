import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // ✅ Import Auth Context
import { toast } from 'react-toastify';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth(); // ✅ Get register function from AuthContext

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'gardener',
    location: '',
    climate: '',
    soilType: '',
    experience: 'beginner',
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Register button clicked!"); // ✅ Debugging log

    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        console.log("📡 Sending request to backend..."); // ✅ Debugging log

        const response = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          password: formData.password,
          email: formData.email,
          role: formData.role,
        });

        console.log("✅ Registration successful!", response);
        toast.success('Registration successful!');
        navigate('/');
      } catch (error) {
        console.error("❌ Registration failed:", error.message);
        toast.error(error.message || 'Registration failed');
      }
    } else {
      console.warn("⚠️ Validation errors:", newErrors);
      setErrors(newErrors);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
            <Typography component="h1" variant="h4" sx={{ mb: 4, color: '#2e7d32', textAlign: 'center' }}>
              Create Your GardenCare Account
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="First Name" value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    error={!!errors.firstName} helperText={errors.firstName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Last Name" value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    error={!!errors.lastName} helperText={errors.lastName} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Username" value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    error={!!errors.username} helperText={errors.username} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={!!errors.email} helperText={errors.email} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="password" label="Password" value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={!!errors.password} helperText={errors.password} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="password" label="Confirm Password" value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    error={!!errors.confirmPassword} helperText={errors.confirmPassword} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select value={formData.role} label="Role"
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                      <MenuItem value="gardener">Gardener</MenuItem>
                      <MenuItem value="supervisor">Supervisor</MenuItem>
                      <MenuItem value="homeowner">Home Owner</MenuItem>
                      <MenuItem value="admin">System Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button type="submit" fullWidth variant="contained" sx={{
                mt: 4, mb: 2, py: 1.5, backgroundColor: '#2e7d32',
                '&:hover': { backgroundColor: '#1b5e20' }
              }}>
                Register
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link to="/" style={{ color: '#2e7d32', textDecoration: 'none', fontWeight: 600 }}>
                    Login here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default Register;
