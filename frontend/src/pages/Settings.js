import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { setCurrentUser } from '../store/slices/userSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  const [formData, setFormData] = useState({
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    work: currentUser?.work || '',
    education: currentUser?.education || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setFormData({
      bio: currentUser.bio || '',
      location: currentUser.location || '',
      work: currentUser.work || '',
      education: currentUser.education || '',
    });
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const response = await api.put(`/users/${currentUser.id}`, formData);
      dispatch(setCurrentUser(response.data));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F0F2F5', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Container maxWidth="md" sx={{ py: 3, flex: 1 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Settings
          </Typography>

          <Card sx={{ borderRadius: '8px' }}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Work"
                  name="work"
                  value={formData.work}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ bgcolor: '#1877F2' }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default Settings;
