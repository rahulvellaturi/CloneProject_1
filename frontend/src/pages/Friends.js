import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Card, CardContent, Avatar, Button, Grid } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Friends = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.users);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await api.get('/friends/requests');
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Fetch friend requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.post(`/friends/accept/${requestId}`);
      fetchFriendRequests();
    } catch (error) {
      console.error('Accept request error:', error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await api.post(`/friends/decline/${requestId}`);
      fetchFriendRequests();
    } catch (error) {
      console.error('Decline request error:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F0F2F5', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Friend Requests
          </Typography>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : friendRequests.length === 0 ? (
            <Typography color="text.secondary">No pending friend requests</Typography>
          ) : (
            <Grid container spacing={2}>
              {friendRequests.map((request) => (
                <Grid item xs={12} sm={6} md={4} key={request.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                          src={request.sender?.profilePicture}
                          sx={{ width: 80, height: 80, mb: 2 }}
                        />
                        <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                          {request.sender?.fullName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            variant="contained"
                            sx={{ bgcolor: '#1877F2' }}
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            Decline
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Friends;
