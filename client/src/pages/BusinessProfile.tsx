import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Rating,
  Chip,
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
  address: string | {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  mobile: string;
  email: string;
  description: string;
  contact?: {
    phone: string;
    email: string;
    website: string;
  };
  hours?: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  images: string[];
  rating: number;
  reviews: Array<{
    _id: string;
    rating: number;
    comment: string;
    reviewerName: string;
    createdAt: string;
  }>;
  socialMedia?: {
    instagram: string;
    facebook: string;
    linkedin: string;
    twitter: string;
  };
  scrapingStatus: string;
}

const BusinessProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.NODE_ENV === 'production'
          ? process.env.REACT_APP_API_URL_PROD
          : process.env.REACT_APP_API_URL;

        const response = await fetch(`${apiUrl}/businesses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch business details');
        }

        const data = await response.json();
        setBusiness(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching business details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !business) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>{error || 'Business not found'}</Alert>
      </Container>
    );
  }

  // Helper function to get contact information
  const getContactInfo = (field: 'phone' | 'email' | 'website') => {
    return business.contact?.[field] || business[field] || 'N/A';
  };

  // Helper function to get address
  const getAddress = () => {
    if (typeof business.address === 'string') {
      return business.address;
    }
    const addr = business.address as { street: string; city: string; state: string; zipCode: string; country: string };
    return `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zipCode || ''}, ${addr.country || ''}`;
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Grid container spacing={4}>
          {/* Header Section */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                {business.name}
              </Typography>
              <Button variant="outlined" onClick={() => navigate('/')}>
                Back to List
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={business.rating} precision={0.5} readOnly />
              <Typography variant="body1" color="text.secondary">
                ({business.reviews.length} reviews)
              </Typography>
            </Box>
            <Chip label={business.category || 'Uncategorized'} color="primary" sx={{ mb: 2 }} />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography paragraph>
              {business.description || 'No description available.'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography>{getContactInfo('phone')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Mobile
                </Typography>
                <Typography>{business.mobile || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography>{getContactInfo('email')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Website
                </Typography>
                <Typography>
                  {getContactInfo('website') !== 'N/A' ? (
                    <a href={getContactInfo('website')} target="_blank" rel="noopener noreferrer">
                      {getContactInfo('website')}
                    </a>
                  ) : 'N/A'}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Business Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Corporate ID
                </Typography>
                <Typography>{business.corporateId || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Member Class
                </Typography>
                <Typography>{business.memberClass || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Designation
                </Typography>
                <Typography>{business.designation || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact Person
                </Typography>
                <Typography>{business.contactPerson || 'N/A'}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Address
            </Typography>
            <Typography>
              {getAddress()}
            </Typography>

            {business.hours && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Business Hours
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(business.hours).map(([day, hours]) => (
                    <Grid item xs={12} sm={6} key={day}>
                      <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                        {day}
                      </Typography>
                      <Typography>
                        {hours.open} - {hours.close}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {business.images.length > 0 && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Images
                </Typography>
                <Grid container spacing={2}>
                  {business.images.map((image, index) => (
                    <Grid item xs={12} key={index}>
                      <img
                        src={image}
                        alt={`${business.name} - Image ${index + 1}`}
                        style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {business.socialMedia && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Social Media
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(business.socialMedia).map(([platform, url]) => (
                    url && (
                      <Grid item xs={6} key={platform}>
                        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                          {platform}
                        </Typography>
                        <Typography>
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            {url}
                          </a>
                        </Typography>
                      </Grid>
                    )
                  ))}
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* Reviews Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Reviews
            </Typography>
            {business.reviews.length === 0 ? (
              <Typography color="text.secondary">
                No reviews yet. Be the first to review this business!
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {business.reviews.map((review) => (
                  <Grid item xs={12} key={review._id}>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={review.rating} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          by {review.reviewerName}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {review.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BusinessProfile; 