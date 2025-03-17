import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Rating,
  Button,
  Divider,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Card,
  CardContent,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Language,
  Instagram,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

interface Business {
  _id: string;
  name: string;
  corporateId: string;
  phone: string;
  website: string;
  contactPerson: string;
  memberClass: string;
  designation: string;
  category: string;
  address: string;
  mobile: string;
  email: string;
}

const BusinessProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const fetchBusiness = async () => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? process.env.REACT_APP_API_URL_PROD 
        : process.env.REACT_APP_API_URL;

      const response = await fetch(`${apiUrl}/api/businesses/${id}`);
      if (!response.ok) {
        throw new Error('Business not found');
      }
      const data = await response.json();
      setBusiness(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  const handleRefreshScrape = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/businesses/${id}/scrape`, {
        method: 'POST',
      });
      const data = await response.json();
      setBusiness(data);
    } catch (error) {
      console.error('Error refreshing scrape:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error || !business) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography color="error">{error || 'Business not found'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          height: 300,
          bgcolor: theme.palette.primary.main,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/business-hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          mb: 4
        }}
      >
        <Container sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            {business.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating value={4} readOnly />
            <Typography sx={{ color: 'white' }}>4.0 (25 reviews)</Typography>
            <Chip 
              label={business.category || 'Manufacturing'} 
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.9),
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
              icon={<CategoryIcon />}
            />
          </Box>
          <Button
            variant="contained"
            onClick={handleRefreshScrape}
            startIcon={<RefreshIcon />}
            sx={{ 
              bgcolor: 'white', 
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            Refresh Info
          </Button>
        </Container>
      </Box>

      <Container>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon color="primary" />
                  About the Business
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {business.description || 'A leading manufacturer and exporter based in Sialkot, Pakistan.'}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Grid container spacing={2}>
                  {business.location && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn color="action" />
                        <Typography variant="body1" color="text.secondary">
                          {business.location}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {business.phone && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone color="action" />
                        <Typography variant="body1" color="text.secondary">
                          {business.phone}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {business.email && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email color="action" />
                        <Typography variant="body1" color="text.secondary">
                          {business.email}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>Reviews</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>4.0</Typography>
                  <Box>
                    <Rating value={4} readOnly size="large" />
                    <Typography variant="body2" color="text.secondary">
                      Based on 25 reviews
                    </Typography>
                  </Box>
                </Box>
                <Button variant="contained" fullWidth>Write a Review</Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Business Website</Typography>
                {business.website ? (
                  <Button
                    variant="contained"
                    fullWidth
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<Language />}
                  >
                    Visit Website
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Website not available
                  </Typography>
                )}

                {business.hasPublicPresence && business.links && business.links.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>Social Media</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {business.links.map((link, index) => (
                        <IconButton
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2)
                            }
                          }}
                        >
                          {link.includes('instagram') ? <Instagram /> : <Language />}
                        </IconButton>
                      ))}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Business Hours</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Monday - Friday</Typography>
                  <Typography variant="body2" color="text.secondary">9:00 AM - 5:00 PM</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Saturday</Typography>
                  <Typography variant="body2" color="text.secondary">10:00 AM - 2:00 PM</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Sunday</Typography>
                  <Typography variant="body2" color="text.secondary">Closed</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BusinessProfile; 