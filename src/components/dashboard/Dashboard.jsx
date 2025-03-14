import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
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
  Stepper,
  Step,
  StepLabel,
  Stack,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Plus, Edit2, Trash2, CheckCircle, Bell, Calendar, Plane as PlantIcon } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

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

const TaskDialog = ({ open, onClose, task, onSubmit, isEdit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(task || {
    title: '',
    category: '',
    priority: 'medium',
    due: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    notes: '',
    completed: false,
    alerts: false,
  });

  const steps = ['Basic Info', 'Details', 'Review'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    setActiveStep(0);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">Task Information</Typography>
            <TextField
              fullWidth
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <MenuItem value="watering">Watering</MenuItem>
                <MenuItem value="pruning">Pruning</MenuItem>
                <MenuItem value="fertilizing">Fertilizing</MenuItem>
                <MenuItem value="pestControl">Pest Control</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">Task Details</Typography>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="datetime-local"
              label="Due Date"
              value={formData.due}
              onChange={(e) => setFormData({ ...formData, due: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">Review Task</Typography>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                  <Typography variant="body1">{formData.title}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{formData.category}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{formData.priority}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Due Date</Typography>
                  <Typography variant="body1">{format(new Date(formData.due), 'PPP p')}</Typography>
                </Grid>
                {formData.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                    <Typography variant="body1">{formData.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 3 }}>
        <Typography variant="h5" component="div" sx={{ color: 'primary.main' }}>
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<CheckCircle size={18} />}
          >
            {isEdit ? 'Update' : 'Create'} Task
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [alerts, setAlerts] = useState(0);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(savedTasks);
    
    // Calculate alerts based on high priority tasks and upcoming due dates
    const alertCount = savedTasks.filter(task => 
      !task.completed && 
      (task.priority === 'high' || new Date(task.due) <= new Date())
    ).length;
    setAlerts(alertCount);
  }, []);

  const handleSaveTask = (taskData) => {
    const newTasks = selectedTask
      ? tasks.map((task) => (task.id === selectedTask.id ? { ...taskData, id: task.id } : task))
      : [...tasks, { ...taskData, id: Date.now() }];
    
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    setOpenDialog(false);
    setSelectedTask(null);

    // Update alerts count
    const alertCount = newTasks.filter(task => 
      !task.completed && 
      (task.priority === 'high' || new Date(task.due) <= new Date())
    ).length;
    setAlerts(alertCount);
  };

  const handleDeleteTask = (taskId) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));

    // Update alerts count
    const alertCount = newTasks.filter(task => 
      !task.completed && 
      (task.priority === 'high' || new Date(task.due) <= new Date())
    ).length;
    setAlerts(alertCount);
  };

  const handleToggleComplete = (taskId) => {
    const newTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));

    // Update alerts count
    const alertCount = newTasks.filter(task => 
      !task.completed && 
      (task.priority === 'high' || new Date(task.due) <= new Date())
    ).length;
    setAlerts(alertCount);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'success',
    };
    return colors[priority] || 'default';
  };

  const todayTasks = tasks.filter(task => 
    isToday(new Date(task.due)) && !task.completed
  ).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.firstName || 'Gardener'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your garden tasks and track your progress
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Tasks
              </Typography>
              <Typography variant="h3" color="primary">
                {todayTasks}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Bell size={24} color={alerts > 0 ? '#d32f2f' : '#666'} />
                <Typography variant="h6" gutterBottom>
                  Upcoming Alerts
                </Typography>
              </Box>
              <Typography variant="h3" color="error">
                {alerts}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Task List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Task Management</Typography>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => {
                  setSelectedTask(null);
                  setOpenDialog(true);
                }}
              >
                Add Task
              </Button>
            </Box>

            <Grid container spacing={2}>
              {tasks.map((task) => (
                <Grid item xs={12} key={task.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                textDecoration: task.completed ? 'line-through' : 'none',
                                color: task.completed ? 'text.secondary' : 'text.primary'
                              }}
                            >
                              {task.title}
                            </Typography>
                            {task.completed && (
                              <Chip
                                label="Completed"
                                size="small"
                                color="success"
                                icon={<CheckCircle size={14} />}
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {task.notes}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={task.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={task.priority}
                              size="small"
                              color={getPriorityColor(task.priority)}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              variant="contained"
                              color={task.completed ? "error" : "success"}
                              onClick={() => handleToggleComplete(task.id)}
                              startIcon={<CheckCircle size={18} />}
                            >
                              {task.completed ? 'Mark Incomplete' : 'Complete'}
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedTask(task);
                                setOpenDialog(true);
                              }}
                            >
                              <Edit2 size={18} />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {tasks.length === 0 && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      color: 'text.secondary',
                    }}
                  >
                    <PlantIcon size={48} style={{ opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      No tasks yet
                    </Typography>
                    <Typography variant="body2">
                      Click the "Add Task" button to create your first task
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <TaskDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSubmit={handleSaveTask}
        isEdit={!!selectedTask}
      />
    </Container>
  );
}

export default Dashboard;