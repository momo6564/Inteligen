import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
} from '@mui/material';

interface BusinessForm {
  name: string;
  corporateId?: string;
  phone?: string;
  website?: string;
  description?: string;
  businessType?: string;
  location?: string;
  email?: string;
  isOpen: boolean;
  openToNewBusiness: boolean;
  machinery?: {
    name: string;
    quantity: number;
    specifications?: string;
  }[];
}

const initialBusinessForm: BusinessForm = {
  name: '',
  corporateId: '',
  phone: '',
  website: '',
  description: '',
  businessType: '',
  location: '',
  email: '',
  isOpen: true,
  openToNewBusiness: true,
  machinery: [],
};

const AddBusiness: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessForm>(initialBusinessForm);
  const [importError, setImportError] = useState<string | null>(null);
  const [showMachinerySection, setShowMachinerySection] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.checked,
    }));
  };

  const handleMachineryToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowMachinerySection(e.target.checked);
    if (!e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        machinery: [],
      }));
    }
  };

  const handleMachineryChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      machinery: prev.machinery?.map((machine, i) => 
        i === index ? { ...machine, [field]: value } : machine
      ),
    }));
  };

  const addMachinery = () => {
    setFormData((prev) => ({
      ...prev,
      machinery: [...(prev.machinery || []), { name: '', quantity: 1, specifications: '' }],
    }));
  };

  const removeMachinery = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      machinery: prev.machinery?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? process.env.REACT_APP_API_URL_PROD 
        : process.env.REACT_APP_API_URL;

      const response = await fetch(`${apiUrl}/api/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create business');
      }

      navigate('/businesses');
    } catch (error) {
      console.error('Error creating business:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImportError(null);

    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const apiUrl = process.env.NODE_ENV === 'production' 
          ? process.env.REACT_APP_API_URL_PROD 
          : process.env.REACT_APP_API_URL;

        try {
          const response = await fetch(`${apiUrl}/api/businesses/bulk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ businesses: jsonData }),
          });

          if (!response.ok) {
            throw new Error('Failed to import businesses');
          }

          const result = await response.json();
          console.log('Import successful:', result);
          navigate('/businesses');
        } catch (error) {
          setImportError('Failed to import businesses. Please check your spreadsheet format.');
          console.error('Import error:', error);
        }
      };

      reader.onerror = () => {
        setImportError('Error reading file');
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      setImportError('Error processing file');
      console.error('File processing error:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add Your Business
        </Typography>

        {/* Add Bulk Import Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Bulk Import Businesses
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload an Excel spreadsheet (.xlsx) containing businesses. Only the name column is required.
          </Typography>
          <input
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Upload Spreadsheet
            </Button>
          </label>
          {importError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {importError}
            </Alert>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Or Add Single Business
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Business Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Optional Fields */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                Optional Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Corporate ID"
                name="corporateId"
                value={formData.corporateId}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Business Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Type"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isOpen}
                    onChange={handleSwitchChange('isOpen')}
                  />
                }
                label="Business is Currently Open"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.openToNewBusiness}
                    onChange={handleSwitchChange('openToNewBusiness')}
                  />
                }
                label="Open to New Business"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showMachinerySection}
                    onChange={handleMachineryToggle}
                  />
                }
                label="Add Machinery Details"
              />
            </Grid>

            {showMachinerySection && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Machinery
                  </Typography>
                  {formData.machinery?.map((machine, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Machine Name"
                            value={machine.name}
                            onChange={(e) => handleMachineryChange(index, 'name', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Quantity"
                            value={machine.quantity}
                            onChange={(e) => handleMachineryChange(index, 'quantity', parseInt(e.target.value))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Specifications"
                            value={machine.specifications}
                            onChange={(e) => handleMachineryChange(index, 'specifications', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Button
                            color="error"
                            onClick={() => removeMachinery(index)}
                            sx={{ minWidth: 'auto', p: 1 }}
                          >
                            ×
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={addMachinery}
                    sx={{ mt: 2 }}
                  >
                    Add Machine
                  </Button>
                </Grid>
              </>
            )}
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/businesses')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Add Business
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddBusiness; 