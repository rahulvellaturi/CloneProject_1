import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Groups = () => {
  return (
    <Box sx={{ bgcolor: '#F0F2F5', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
          <Typography variant="h4">Groups</Typography>
          <Typography variant="body1" color="text.secondary">
            Groups feature coming soon...
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Groups;
