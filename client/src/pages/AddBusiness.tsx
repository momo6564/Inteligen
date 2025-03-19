import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Divider,
} from '@mui/material';

interface BusinessFormData {
  name: string;
  corporateId: string;
  phone: string;
  website: string;
  contactPerson: string;
  memberClass: string;
  designation: string;
  category: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  mobile: string;
  email: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  hours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
}

const initialFormData: BusinessFormData = {
  name: '',
  corporateId: '',
  phone: '',
  website: '',
  contactPerson: '',
  memberClass: '',
  designation: '',
  category: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  mobile: '',
  email: '',
  description: '',
  contact: {
    phone: '',
    email: '',
    website: '',
  },
  hours: {
    monday: { open: '09:00', close: '17:00' },
    tuesday: { open: '09:00', close: '17:00' },
    wednesday: { open: '09:00', close: '17:00' },
    thursday: { open: '09:00', close: '17:00' },
    friday: { open: '09:00', close: '17:00' },
    saturday: { open: '09:00', close: '17:00' },
    sunday: { open: '09:00', close: '17:00' },
  },
};

const categories = [
  'Restaurant',
  'Retail',
  'Service',
  'Manufacturing',
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Other',
];

const AddBusiness: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
  const [importError, setImportError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ): void => {
    const { name, value } = e.target;
    
    if (!name) return;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof BusinessFormData] as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name as keyof BusinessFormData]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setImportError(null);

    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_URL_PROD
        : process.env.REACT_APP_API_URL;
      console.log('Using API URL:', apiUrl);
      console.log('Submitting form data:', formData);

      const response = await fetch(`${apiUrl}/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to add business');
      }

      const data = await response.json();
      console.log('Response data:', data);
      navigate(`/business/${data._id}`);
    } catch (err) {
      console.error('Error adding business:', err);
      setImportError(err instanceof Error ? err.message : 'An error occurred while adding the business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Business
        </Typography>

        {importError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {importError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Business Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Corporate ID"
                name="corporateId"
                value={formData.corporateId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Contact Person"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Contact Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Street Address"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="ZIP Code"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
              />
            </Grid>

            {/* Business Hours */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Business Hours
              </Typography>
            </Grid>
            {Object.entries(formData.hours).map(([day, hours]) => (
              <React.Fragment key={day}>
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    {day}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Open"
                    name={`hours.${day}.open`}
                    value={hours.open}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Close"
                    name={`hours.${day}.close`}
                    value={hours.close}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </React.Fragment>
            ))}

            {/* Description */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Description
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Business Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Business'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddBusiness; 