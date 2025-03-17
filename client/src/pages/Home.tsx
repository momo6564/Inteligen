import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Business Directory
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Connect with local businesses, showcase your equipment, and build valuable partnerships
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <SearchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Find Businesses
            </Typography>
            <Typography color="text.secondary" paragraph>
              Browse through our directory of local businesses and their equipment
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/businesses')}
              sx={{ mt: 'auto' }}
            >
              Browse Directory
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              List Your Business
            </Typography>
            <Typography color="text.secondary" paragraph>
              Add your business to our directory and showcase your equipment
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/add-business')}
              sx={{ mt: 'auto' }}
            >
              Add Business
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 