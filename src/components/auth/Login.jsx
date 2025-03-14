import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login({ username: formData.username, password: formData.password }); // ✅ Fixed API Call
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
            <Typography component="h1" variant="h4" sx={{ mb: 3, color: '#2e7d32' }}>
              Welcome to GardenCare
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField fullWidth label="Username" value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })} required sx={{ mb: 2 }} />

              <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} required
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{ endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                )}} sx={{ mb: 3 }} />

              <Button type="submit" fullWidth variant="contained" sx={{ mb: 2, py: 1.5, backgroundColor: '#2e7d32' }}>
                Sign In
              </Button>

              <Typography variant="body2" align="center">
                Don't have an account? <Link to="/register" style={{ color: '#2e7d32', fontWeight: 600 }}>Sign Up</Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Login;
