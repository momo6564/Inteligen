import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Box,
  Pagination,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material';

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

interface ApiResponse {
  businesses: Business[];
  totalPages: number;
  totalBusinesses: number;
}

const BusinessList: React.FC = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrapedOnly, setShowScrapedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL;
      console.log('Using API URL:', apiUrl);

      const response = await fetch(`${apiUrl}/businesses?page=${page}&showScrapedOnly=${showScrapedOnly}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }

      const data = await response.json();
      setBusinesses(data.businesses);
      setTotalPages(data.totalPages);
      setTotalBusinesses(data.totalBusinesses);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while fetching businesses');
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  }, [page, showScrapedOnly]);

  useEffect(() => {
    fetchBusinesses();
  }, [page, showScrapedOnly, fetchBusinesses]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.corporateId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Business Directory
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Search businesses"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ maxWidth: 400 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showScrapedOnly}
                onChange={(e) => setShowScrapedOnly(e.target.checked)}
              />
            }
            label="Show only scraped businesses"
          />
        </Box>

        {filteredBusinesses.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No businesses found
          </Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredBusinesses.map((business) => (
                <Grid item xs={12} sm={6} md={4} key={business._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {business.name}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        Corporate ID: {business.corporateId}
                      </Typography>
                      <Typography variant="body2">
                        Phone: {business.phone}
                      </Typography>
                      <Typography variant="body2">
                        Website: {business.website}
                      </Typography>
                      <Typography variant="body2">
                        Contact: {business.contactPerson}
                      </Typography>
                      <Typography variant="body2">
                        Designation: {business.designation}
                      </Typography>
                      <Typography variant="body2">
                        Category: {business.category}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Box sx={{ flexGrow: 1 }} />
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/business/${business._id}`)}
                      >
                        View Details
                      </Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default BusinessList; 