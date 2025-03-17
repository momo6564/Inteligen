import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Rating,
  Divider,
  Button,
  AppBar,
  Toolbar,
  useTheme,
  alpha
} from '@mui/material';
import { Search as SearchIcon, LocationOn, Phone, Email, Language, Instagram } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface Business {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  links?: string[];
  hasPublicPresence: boolean;
}

const BusinessList: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const theme = useTheme();

  const categories = [
    'All',
    'Sports Equipment',
    'Textiles',
    'Leather Goods',
    'Manufacturing',
    'Export',
    'Retail'
  ];

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/businesses');
      const data = await response.json();
      setBusinesses(data.businesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' ? true : business.description?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main, boxShadow: 2 }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Sayrab
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Search Section */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.primary.main, 
          py: 6,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/sialkot.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Container>
          <Typography variant="h3" align="center" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
            Discover Sialkot's Best Businesses
          </Typography>
          <Box sx={{ 
            maxWidth: 600, 
            mx: 'auto',
            bgcolor: 'white',
            borderRadius: 2,
            p: 0.5,
            boxShadow: 3
          }}>
            <TextField
              fullWidth
              placeholder="Search businesses in Sialkot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                }
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Categories */}
      <Container sx={{ mt: 4, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? "primary" : "default"}
              sx={{ 
                fontSize: '1rem',
                py: 1,
                '&:hover': {
                  bgcolor: selectedCategory === category ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1)
                }
              }}
            />
          ))}
        </Box>
      </Container>

      {/* Business List */}
      <Container sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {filteredBusinesses.map((business) => (
            <Grid item xs={12} md={6} lg={4} key={business._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                component={Link}
                to={`/business/${business._id}`}
              >
                <Box 
                  sx={{ 
                    height: 200, 
                    bgcolor: theme.palette.grey[200],
                    backgroundImage: 'url("/business-placeholder.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} 
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {business.name}
                    </Typography>
                    <Rating value={4} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {business.description || 'Manufacturing and Export'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {business.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {business.location}
                      </Typography>
                    </Box>
                  )}

                  {business.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {business.phone}
                      </Typography>
                    </Box>
                  )}

                  {business.hasPublicPresence && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      {business.links?.map((link, index) => (
                        <IconButton 
                          key={index}
                          size="small"
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2)
                            }
                          }}
                        >
                          {link.includes('instagram') ? <Instagram fontSize="small" /> : <Language fontSize="small" />}
                        </IconButton>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BusinessList; 