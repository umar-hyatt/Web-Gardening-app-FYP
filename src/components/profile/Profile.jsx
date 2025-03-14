import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  IconButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  User,
  MapPin,
  Cloud,
  Flower2,
  Trash2,
  Plus,
  Calendar,
  Edit2,
} from 'lucide-react';
import { format } from 'date-fns';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  backgroundColor: theme.palette.primary.main,
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

function Profile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: '',
    location: '',
    climate: '',
    soilType: '',
    registeredDate: '',
  });

  const [plantObservations, setPlantObservations] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const username = localStorage.getItem('username') || '';
    const role = localStorage.getItem('userRole') || '';

    setProfile((prev) => ({
      ...prev,
      ...userProfile,
      username,
      role,
    }));

    const savedObservations = JSON.parse(
      localStorage.getItem('plantObservations') || '[]'
    );
    if (savedObservations.length > 0) {
      setPlantObservations(
        savedObservations.map((obs) => ({
          ...obs,
          date: new Date(obs.date),
          plantName: obs.plantName || '',
          height: obs.height || '',
          health: obs.health || 'good',
          notes: obs.notes || '',
          nextAction: obs.nextAction || '',
        }))
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Profile updated successfully!');
  };

  const handleAddObservation = () => {
    const newObservation = {
      id: Date.now(),
      date: new Date(),
      plantName: '',
      height: '',
      health: 'good',
      notes: '',
      nextAction: '',
    };
    const updatedObservations = [...plantObservations, newObservation];
    setPlantObservations(updatedObservations);
    localStorage.setItem(
      'plantObservations',
      JSON.stringify(updatedObservations)
    );
  };

  const handleObservationChange = (id, field, value) => {
    const updatedObservations = plantObservations.map((obs) =>
      obs.id === id ? { ...obs, [field]: value } : obs
    );
    setPlantObservations(updatedObservations);
    localStorage.setItem(
      'plantObservations',
      JSON.stringify(updatedObservations)
    );
  };

  const handleDeleteObservation = (id) => {
    const updatedObservations = plantObservations.filter(
      (obs) => obs.id !== id
    );
    setPlantObservations(updatedObservations);
    localStorage.setItem(
      'plantObservations',
      JSON.stringify(updatedObservations)
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
              color: 'white',
            }}
          >
            <Grid container alignItems="center" spacing={3}>
              <Grid item>
                <StyledAvatar>
                  <User size={40} />
                </StyledAvatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4">
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                  {profile.role && profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={16} />
                    <Typography variant="body2">{profile.location || 'No location set'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} />
                    <Typography variant="body2">
                      Joined {profile.registeredDate ? format(new Date(profile.registeredDate), 'MMM yyyy') : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ borderRadius: 2 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label="Profile Information" />
              <Tab label="Growth Tracking" />
            </Tabs>

            {/* Profile Information Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleSubmit} sx={{ px: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profile.firstName || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profile.lastName || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      value={profile.username || ''}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={profile.role || ''}
                        label="Role"
                        onChange={(e) =>
                          setProfile({ ...profile, role: e.target.value })
                        }
                      >
                        <MenuItem value="gardener">Gardener</MenuItem>
                        <MenuItem value="supervisor">Supervisor</MenuItem>
                        <MenuItem value="homeowner">Home Owner</MenuItem>
                        <MenuItem value="admin">System Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={profile.location || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Climate</InputLabel>
                      <Select
                        value={profile.climate || ''}
                        label="Climate"
                        onChange={(e) =>
                          setProfile({ ...profile, climate: e.target.value })
                        }
                      >
                        <MenuItem value="">Select climate</MenuItem>
                        <MenuItem value="tropical">Tropical</MenuItem>
                        <MenuItem value="temperate">Temperate</MenuItem>
                        <MenuItem value="arid">Arid</MenuItem>
                        <MenuItem value="mediterranean">Mediterranean</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Soil Type</InputLabel>
                      <Select
                        value={profile.soilType || ''}
                        label="Soil Type"
                        onChange={(e) =>
                          setProfile({ ...profile, soilType: e.target.value })
                        }
                      >
                        <MenuItem value="">Select soil type</MenuItem>
                        <MenuItem value="clay">Clay</MenuItem>
                        <MenuItem value="sandy">Sandy</MenuItem>
                        <MenuItem value="loamy">Loamy</MenuItem>
                        <MenuItem value="silty">Silty</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    startIcon={<Edit2 />}
                  >
                    Update Profile
                  </Button>
                </Box>
              </Box>
            </TabPanel>

            {/* Growth Tracking Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: 2 }}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Plant Growth Observations</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={handleAddObservation}
                  >
                    Add Observation
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Plant</TableCell>
                        <TableCell>Height</TableCell>
                        <TableCell>Health</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Next Action</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {plantObservations.map((obs) => (
                        <TableRow key={obs.id}>
                          <TableCell>
                            {format(new Date(obs.date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={obs.plantName}
                              onChange={(e) =>
                                handleObservationChange(
                                  obs.id,
                                  'plantName',
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={obs.height}
                              onChange={(e) =>
                                handleObservationChange(
                                  obs.id,
                                  'height',
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={obs.health}
                                onChange={(e) =>
                                  handleObservationChange(
                                    obs.id,
                                    'health',
                                    e.target.value
                                  )
                                }
                              >
                                <MenuItem value="excellent">Excellent</MenuItem>
                                <MenuItem value="good">Good</MenuItem>
                                <MenuItem value="fair">Fair</MenuItem>
                                <MenuItem value="poor">Poor</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={obs.notes}
                              onChange={(e) =>
                                handleObservationChange(
                                  obs.id,
                                  'notes',
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={obs.nextAction}
                              onChange={(e) =>
                                handleObservationChange(
                                  obs.id,
                                  'nextAction',
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteObservation(obs.id)}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {plantObservations.length === 0 && (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      color: 'text.secondary',
                    }}
                  >
                    <Flower2 size={48} style={{ opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      No observations yet
                    </Typography>
                    <Typography variant="body2">
                      Start tracking your plants' growth by adding an observation
                    </Typography>
                  </Box>
                )}
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;