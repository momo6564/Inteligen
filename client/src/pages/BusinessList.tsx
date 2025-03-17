import React, { useState, useEffect } from 'react';
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

const BusinessList: React.FC = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrapedOnly, setShowScrapedOnly] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, [page, showScrapedOnly]);

  const fetchBusinesses = async () => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? process.env.REACT_APP_API_URL_PROD 
        : process.env.REACT_APP_API_URL;

      const response = await fetch(
        `${apiUrl}/api/businesses?page=${page}&limit=12&scrapedOnly=${showScrapedOnly}`
      );
      const data = await response.json();
      setBusinesses(data.businesses);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

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
                    onClick={() => navigate(`/businesses/${business._id}`)}
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
      </Paper>
    </Container>
  );
};

export default BusinessList; 