import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
  Button,
} from '@mui/material';
import {
  Menu,
  Home,
  User,
  LogOut,
  Sprout,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const drawerWidth = 240;

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Home size={24} />, path: '/dashboard' },
    { text: 'Plants', icon: <Sprout size={24} />, path: '/plants' },
    { text: 'Profile', icon: <User size={24} />, path: '/profile' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : theme.spacing(7),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : theme.spacing(7),
            boxSizing: 'border-box',
            backgroundColor: '#1b4332',
            color: 'white',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
            padding: theme.spacing(2),
            minHeight: 64,
          }}
        >
          {open && (
            <Typography variant="h6" component="div">
              GardenCare
            </Typography>
          )}
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            {open ? (
              <ChevronLeft size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </IconButton>
        </Box>

        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                backgroundColor:
                  location.pathname === item.path
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: 1,
                    color: 'white',
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleLogout}
            startIcon={<LogOut size={20} />}
            sx={{
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#c62828',
              },
            }}
          >
            {open ? 'Logout' : ''}
          </Button>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${open ? drawerWidth : theme.spacing(7)}px)`,
          marginLeft: `${open ? drawerWidth : theme.spacing(7)}px`,
          transition: theme.transitions.create(['width', 'margin-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Main content will be rendered here */}
      </Box>
    </Box>
  );
}

export default Navigation;