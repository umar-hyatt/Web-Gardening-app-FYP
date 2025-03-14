import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Chip,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Sprout,
  Filter,
} from 'lucide-react';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const PlantDialog = ({ open, onClose, plant, onSubmit, isEdit }) => {
  const [formData, setFormData] = useState(plant || {
    name: '',
    category: '',
    image: '',
    characteristics: '',
    careRequirements: '',
    growthStage: '',
    age: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Plant' : 'Add New Plant'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Plant Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <MenuItem value="Vegetables">Vegetables</MenuItem>
                  <MenuItem value="Fruits">Fruits</MenuItem>
                  <MenuItem value="Flowers">Flowers</MenuItem>
                  <MenuItem value="Herbs">Herbs</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Characteristics"
                value={formData.characteristics}
                onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Care Requirements"
                value={formData.careRequirements}
                onChange={(e) => setFormData({ ...formData, careRequirements: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Growth Stage</InputLabel>
                <Select
                  value={formData.growthStage}
                  label="Growth Stage"
                  onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                  required
                >
                  <MenuItem value="Seedling">Seedling</MenuItem>
                  <MenuItem value="Vegetative">Vegetative</MenuItem>
                  <MenuItem value="Flowering">Flowering</MenuItem>
                  <MenuItem value="Fruiting">Fruiting</MenuItem>
                  <MenuItem value="Mature">Mature</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? 'Update' : 'Add'} Plant
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

function PlantDatabase() {
  const [plants, setPlants] = useState([
    {
      id: 1,
      name: 'Sweet Strawberry',
      category: 'Fruits',
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=500',
      characteristics: 'June-bearing variety, produces large sweet fruits',
      careRequirements: 'Full sun, regular watering, well-draining soil',
      growthStage: 'Mature',
      age: '3 months',
    },
    // Add more plants as needed
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const handleSavePlant = (plantData) => {
    const newPlants = selectedPlant
      ? plants.map((plant) => (plant.id === selectedPlant.id ? { ...plantData, id: plant.id } : plant))
      : [...plants, { ...plantData, id: Date.now() }];
    
    setPlants(newPlants);
    setOpenDialog(false);
    setSelectedPlant(null);
  };

  const handleDeletePlant = (plantId) => {
    setPlants(plants.filter((plant) => plant.id !== plantId));
  };

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.characteristics.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Plant Database
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage and track your garden plants
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Filter size={20} />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Vegetables">Vegetables</MenuItem>
                <MenuItem value="Fruits">Fruits</MenuItem>
                <MenuItem value="Flowers">Flowers</MenuItem>
                <MenuItem value="Herbs">Herbs</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Plus />}
              onClick={() => {
                setSelectedPlant(null);
                setOpenDialog(true);
              }}
            >
              Add Plant
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredPlants.map((plant) => (
          <Grid item xs={12} sm={6} md={4} key={plant.id}>
            <StyledCard>
              <CardMedia
                component="img"
                height="200"
                image={plant.image}
                alt={plant.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {plant.name}
                    </Typography>
                    <Chip
                      label={plant.category}
                      size="small"
                      color="primary"
                      icon={<Sprout size={14} />}
                    />
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedPlant(plant);
                        setOpenDialog(true);
                      }}
                    >
                      <Edit2 size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeletePlant(plant.id)}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Characteristics
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {plant.characteristics}
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Care Requirements
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {plant.careRequirements}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Chip
                    label={`Age: ${plant.age}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={plant.growthStage}
                    size="small"
                    color="success"
                  />
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
        {filteredPlants.length === 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                color: 'text.secondary',
              }}
            >
              <Sprout size={48} style={{ opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                No plants found
              </Typography>
              <Typography variant="body2">
                Try adjusting your search or add a new plant
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <PlantDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedPlant(null);
        }}
        plant={selectedPlant}
        onSubmit={handleSavePlant}
        isEdit={!!selectedPlant}
      />
    </Container>
  );
}

export default PlantDatabase;