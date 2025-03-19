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
  coverPhoto?: string;
  reviewCount?: number;
}

const CoverPhoto = styled('div')(({ theme }) => ({
  height: '300px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::after': {
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
  width: '120px',
  height: '120px',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '4px solid white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const Logo = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

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

        const response = await fetch(`${apiUrl}/businesses/${id}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch business details');
        }

        const data = await response.json();
        console.log('Business data:', data);
        setBusiness(data);
      } catch (err) {
        console.error('Error fetching business:', err);
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
    if (!selectedFile || !uploadType) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', uploadType);

      const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_URL_PROD
        : process.env.REACT_APP_API_URL;

      const response = await fetch(`${apiUrl}/businesses/${id}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const updatedBusiness = await response.json();
      setBusiness(updatedBusiness);
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !business) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Business not found'}</Alert>
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
    <Box>
      <CoverPhoto
        style={{
          backgroundImage: business.coverPhoto
            ? `url(${business.coverPhoto})`
            : 'url(https://source.unsplash.com/random/1600x900/?business)',
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
      </CoverPhoto>

      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {business.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={business.rating || 0} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({business.reviewCount || 0} reviews)
                </Typography>
              </Box>
              <Typography variant="subtitle1" color="text.secondary">
                {business.category}
              </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography variant="body1" paragraph>
                {business.description || 'No description available.'}
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Business Hours
              </Typography>
              {business.hours && Object.entries(business.hours).map(([day, hours]: [string, any]) => (
                <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{day}</Typography>
                  <Typography variant="body2">
                    {hours.open} - {hours.close}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">{getAddress()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">{getContactInfo('phone')}</Typography>
              </Box>
              {business.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">{getContactInfo('email')}</Typography>
                </Box>
              )}
              {business.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Language sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">
                    <a href={getContactInfo('website')} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Typography>
                </Box>
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map((review: any) => (
                  <Box key={review._id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={review.rating} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        by {review.reviewerName}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {review.comment}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No reviews yet.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>
          Upload {uploadType === 'logo' ? 'Logo' : 'Cover Photo'}
        </DialogTitle>
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
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusinessProfile; 