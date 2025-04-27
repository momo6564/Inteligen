import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  TextField,
  Box,
  Pagination,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Rating,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Button from '@mui/material/Button';
import {
  Search as SearchIcon,
  LocationOn,
  Star,
  Business,
  AccessTime,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const HeroSection = styled('div')(({ theme }) => ({
  background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://source.unsplash.com/random/1600x900/?business)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const BusinessCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const formatAddress = (address: any) => {
  if (!address) return 'Address not available';
  if (typeof address === 'string') return address;
  
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zipCode) parts.push(address.zipCode);
  if (address.country) parts.push(address.country);
  
  return parts.join(', ');
};

const BusinessList: React.FC = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const [showScrapedOnly, setShowScrapedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 12;

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_URL_PROD
        : process.env.REACT_APP_API_URL;

      const response = await fetch(
        `${apiUrl}/businesses?page=${page}&limit=${itemsPerPage}&showScrapedOnly=${showScrapedOnly}&search=${searchQuery}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }

      const data = await response.json();
      setBusinesses(data.businesses);
      setTotalPages(data.totalPages);
      setTotalBusinesses(data.totalBusinesses);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while fetching businesses');
    } finally {
      setLoading(false);
    }
  }, [page, showScrapedOnly, searchQuery]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleShowScrapedOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowScrapedOnly(event.target.checked);
    setPage(1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Local Businesses
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Find and explore the best businesses in your area
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Found {totalBusinesses} businesses
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showScrapedOnly}
                onChange={handleShowScrapedOnlyChange}
                color="primary"
              />
            }
            label="Show verified businesses only"
          />
        </Box>

        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Grid container spacing={4}>
              {businesses.map((business) => (
                <Grid item xs={12} sm={6} md={4} key={business._id}>
                  <BusinessCard>
                    <CardMedia
                      component="img"
                      height="200"
                      image={business.coverPhoto || `https://source.unsplash.com/random/400x300/?${business.category}`}
                      alt={business.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {business.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={business.rating || 0} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({business.reviewCount || 0})
                        </Typography>
                      </Box>
                      <Chip
                        label={business.category}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatAddress(business.address)}
                        </Typography>
                      </Box>
                      {business.hours && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {business.hours[new Date().getDay()]?.open || 'Closed'}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/business/${business._id}`)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </BusinessCard>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default BusinessList; 