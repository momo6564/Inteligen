import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container, Alert, Typography, Button } from '@mui/material';
import Navbar from './components/Navbar';
import BusinessList from './pages/BusinessList';
import BusinessProfile from './pages/BusinessProfile';
import AddBusiness from './pages/AddBusiness';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" paragraph>
              {this.state.error?.message || "An unknown error occurred"}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => window.location.href = '/'}
            >
              Go to Home Page
            </Button>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App; 