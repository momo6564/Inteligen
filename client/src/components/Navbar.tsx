import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddBusiness = () => {
    navigate('/businesses/add');
    handleClose();
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'white', boxShadow: 1 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: 'bold',
              flexGrow: 1,
            }}
          >
            Sayrab
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddBusiness}
              >
                Add Business
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonIcon />}
              >
                Sign In
              </Button>
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <>
              <IconButton
                size="large"
                edge="end"
                color="primary"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleAddBusiness}>
                  <AddIcon sx={{ mr: 1 }} /> Add Business
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <PersonIcon sx={{ mr: 1 }} /> Sign In
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 