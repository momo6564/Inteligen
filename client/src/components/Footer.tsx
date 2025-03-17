import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'About',
      links: [
        { text: 'About Sayrab', to: '/about' },
        { text: 'Careers', to: '/careers' },
        { text: 'Press', to: '/press' },
        { text: 'Contact Us', to: '/contact' },
      ],
    },
    {
      title: 'Businesses',
      links: [
        { text: 'Add a Business', to: '/businesses/add' },
        { text: 'Claim your Business', to: '/businesses/claim' },
        { text: 'Business Success Stories', to: '/success-stories' },
        { text: 'Business Support', to: '/support' },
      ],
    },
    {
      title: 'Categories',
      links: [
        { text: 'Sports Equipment', to: '/category/sports' },
        { text: 'Textiles', to: '/category/textiles' },
        { text: 'Leather Goods', to: '/category/leather' },
        { text: 'Manufacturing', to: '/category/manufacturing' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {sections.map((section) => (
            <Grid item xs={12} sm={4} key={section.title}>
              <Typography
                variant="h6"
                color="text.primary"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                {section.title}
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.text} sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to={link.to}
                      color="text.secondary"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Sayrab. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 