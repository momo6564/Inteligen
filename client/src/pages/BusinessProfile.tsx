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
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PhotoCamera,
  Edit as EditIcon,
  LocationOn,
  Phone,
  Email,
  Language,
  AccessTime,
  Business,
  Star,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const CoverPhoto = styled('div')(({ theme }) => ({
  height: '300px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
  },
}));

const LogoContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: '-50px',
  left: '50px',
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  overflow: 'hidden',
  border: '4px solid white',
  boxShadow: theme.shadows[3],
}));

const Logo = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

// Interfaces
interface Business {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  address: string | Record<string, any>;
  phone?: string;
  email?: string;
  website?: string;
  hours?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
  reviews?: Array<{
    _id: string;
    rating: number;
    comment: string;
    reviewerName: string;
    createdAt: string;
  }>;
  logo?: string;
  coverPhoto?: string;
  corporateId?: string;
  contactPerson?: string;
  designation?: string;
  memberClass?: string;
  mobile?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

const BusinessProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'logo' | 'cover' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.NODE_ENV === 'production'
          ? process.env.REACT_APP_API_URL_PROD
          : process.env.REACT_APP_API_URL;
        
        console.log('Using API URL:', apiUrl);
        console.log('Fetching business with ID:', id);

        // Use the first business from the list as a fallback if direct fetch fails
        let business = null;
        let error = null;

        try {
          // First try to fetch the specific business
          const response = await fetch(`${apiUrl}/businesses/${id}`);
          console.log('Response status for specific business:', response.status);
          
          if (response.ok) {
            business = await response.json();
            console.log('Found specific business:', business);
          } else {
            console.log('Failed to fetch specific business, trying list');
            error = await response.json();
          }
        } catch (err) {
          console.error('Error fetching specific business:', err);
        }

        // If specific business fetch failed, try to get it from the list
        if (!business) {
          try {
            const listResponse = await fetch(`${apiUrl}/businesses?limit=100`);
            console.log('List response status:', listResponse.status);
            
            if (listResponse.ok) {
              const data = await listResponse.json();
              console.log(`Found ${data.businesses.length} businesses in list`);
              
              // Find business by ID in the list
              business = data.businesses.find((b: any) => b._id === id);
              
              if (business) {
                console.log('Found business in list:', business);
              } else {
                throw new Error('Business not found in list');
              }
            } else {
              throw new Error('Failed to fetch business list');
            }
          } catch (err) {
            console.error('Error fetching business list:', err);
            if (!error) {
              error = { message: err instanceof Error ? err.message : 'Unknown error' };
            }
          }
        }

        if (business) {
          console.log('Final business data to use:', business);
          setBusiness(business);
        } else {
          throw new Error(error?.message || 'Failed to fetch business details');
        }
      } catch (err) {
        console.error('Error in business fetch process:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching business details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadType || !id) return;
    
    try {
      setLoading(true);
      const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_URL_PROD
        : process.env.REACT_APP_API_URL;

      // Using simplified API that doesn't need actual file upload
      const response = await fetch(`${apiUrl}/businesses/${id}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: uploadType }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update image');
      }

      const updatedBusiness = await response.json();
      setBusiness(updatedBusiness);
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update image');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get formatted address
  const getFormattedAddress = () => {
    if (!business) return '';
    
    if (typeof business.address === 'string') {
      return business.address;
    }
    
    if (typeof business.address === 'object') {
      const addr = business.address as Record<string, any>;
      if (addr.street || addr.city) {
        return `${addr.street || ''}, ${addr.city || ''} ${addr.state || ''} ${addr.zipCode || ''}, ${addr.country || ''}`.trim();
      }
    }
    
    return 'Address not available';
  };

  // Helper function to safely access properties
  const getContactInfo = (field: 'phone' | 'email' | 'website') => {
    if (!business) return '';
    
    // First check if it's directly on the business object
    if (business[field]) {
      return business[field];
    }
    
    // Then check if it's in the contact object
    if (business.contact && business.contact[field]) {
      return business.contact[field];
    }
    
    // If phone is requested, try mobile as fallback
    if (field === 'phone' && business.mobile) {
      return business.mobile;
    }
    
    return '';
  };

  // Helper to get reviews safely
  const getReviews = () => {
    if (!business) return [];
    return business.reviews || [];
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!business) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Business not found
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      <CoverPhoto
        sx={{
          backgroundImage: business?.coverPhoto
            ? `url(${business.coverPhoto})`
            : 'url(/default-cover.jpg.jpg)',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.7)',
            },
          }}
          onClick={() => {
            setUploadType('cover');
            setUploadDialogOpen(true);
          }}
        >
          <PhotoCamera />
        </IconButton>
        <LogoContainer>
          <Logo
            src={business?.logo || '/default-logo.jpg.jpg'}
            alt={business?.name || 'Business Logo'}
          />
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
            onClick={() => {
              setUploadType('logo');
              setUploadDialogOpen(true);
            }}
          >
            <PhotoCamera />
          </IconButton>
        </LogoContainer>
      </CoverPhoto>

      <Container sx={{ mt: 16, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {business?.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={business?.rating || 0} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({business?.reviewCount || getReviews().length || 0} reviews)
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {business?.description || 'No description available'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={business?.category || 'General'} color="primary" />
                {business?.memberClass && (
                  <Chip label={business.memberClass} color="secondary" />
                )}
              </Box>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>
              {getReviews().length > 0 ? (
                getReviews().map((review) => (
                  <Box key={review._id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={review.rating} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        by {review.reviewerName}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{review.comment}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No reviews available yet. Be the first to review!
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">{getFormattedAddress()}</Typography>
              </Box>
              {getContactInfo('phone') && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">{getContactInfo('phone')}</Typography>
                </Box>
              )}
              {getContactInfo('email') && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">{getContactInfo('email')}</Typography>
                </Box>
              )}
              {getContactInfo('website') && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Language sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    <a href={getContactInfo('website')} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Typography>
                </Box>
              )}
              {business?.contactPerson && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Business sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Contact: {business.contactPerson}
                    {business.designation && ` (${business.designation})`}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Upload {uploadType === 'logo' ? 'Logo' : 'Cover Photo'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="image-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Select Image
              </Button>
            </label>
            {previewUrl && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" disabled={!selectedFile}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusinessProfile; 