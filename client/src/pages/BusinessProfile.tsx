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
  description: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: {
    [key: string]: string;
  };
  rating: number;
  reviews: Array<{
    _id: string;
    rating: number;
    comment: string;
    reviewerName: string;
    createdAt: string;
  }>;
  logo?: string;
  coverPhoto?: string;
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

        const response = await fetch(`${apiUrl}/businesses/${id}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch business details');
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
          backgroundImage: business.coverPhoto
            ? `url(${business.coverPhoto})`
            : 'url(https://source.unsplash.com/random/1600x900/?restaurant)',
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

      <LogoContainer>
        <Logo
          src={business.logo || 'https://source.unsplash.com/random/150x150/?logo'}
          alt={business.name}
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

      <Container sx={{ mt: 8, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {business.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={business.rating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({business.reviews.length} reviews)
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {business.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={business.category} color="primary" />
              </Box>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>
              {business.reviews.map((review) => (
                <Box key={review._id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={review.rating} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      by {review.reviewerName}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{review.comment}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">{business.address}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">{business.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">{business.email}</Typography>
              </Box>
              {business.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Language sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    <a href={business.website} target="_blank" rel="noopener noreferrer">
                      {business.website}
                    </a>
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Business Hours
              </Typography>
              {Object.entries(business.hours).map(([day, hours]) => (
                <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {day}
                  </Typography>
                  <Typography variant="body2">{hours}</Typography>
                </Box>
              ))}
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