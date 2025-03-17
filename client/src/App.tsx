import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import BusinessList from './pages/BusinessList';
import BusinessProfile from './pages/BusinessProfile';
import AddBusiness from './pages/AddBusiness';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<BusinessList />} />
          <Route path="/business/:id" element={<BusinessProfile />} />
          <Route path="/add-business" element={<AddBusiness />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App; 