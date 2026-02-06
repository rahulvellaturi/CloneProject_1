import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Avatar, Typography, Button, Tabs, Tab, Card, CardContent } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import api from '../utils/api';
import { setProfileUser } from '../store/slices/userSlice';
import { setFeed } from '../store/slices/postSlice';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profileUser, currentUser } = useSelector((state) => state.users);
  const { feed } = useSelector((state) => state.posts);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      dispatch(setProfileUser(response.data));
    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await api.get(`/posts/user/${id}?page=0&size=20`);
      dispatch(setFeed(response.data.content));
    } catch (error) {
      console.error('Fetch posts error:', error);
    }
  };

  const handleFriendRequest = async () => {
    try {
      await api.post(`/friends/request/${id}`);
      fetchProfile();
    } catch (error) {
      console.error('Friend request error:', error);
    }
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  const isOwnProfile = currentUser?.id === parseInt(id);

  return (
    <Box sx={{ bgcolor: '#F0F2F5', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
          {/* Cover Photo */}
          <Box
            sx={{
              height: '350px',
              bgcolor: '#E4E6EB',
              borderRadius: '8px',
              mb: 2,
              position: 'relative',
              backgroundImage: profileUser?.coverPhoto ? `url(${profileUser.coverPhoto})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Profile Info */}
          <Card sx={{ mb: 2, borderRadius: '8px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2, mt: -8 }}>
                <Avatar
                  src={profileUser?.profilePicture}
                  sx={{ width: 168, height: 168, border: '4px solid white', mr: 2 }}
                />
                <Box sx={{ flex: 1, mb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {profileUser?.fullName}
                  </Typography>
                  {!isOwnProfile && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {profileUser?.isFriend ? (
                        <Button variant="contained" sx={{ bgcolor: '#1877F2' }}>
                          Friends
                        </Button>
                      ) : profileUser?.friendRequestSent ? (
                        <Button variant="outlined">Friend Request Sent</Button>
                      ) : profileUser?.friendRequestReceived ? (
                        <Button variant="contained" sx={{ bgcolor: '#1877F2' }}>
                          Respond to Request
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          sx={{ bgcolor: '#1877F2' }}
                          onClick={handleFriendRequest}
                        >
                          Add Friend
                        </Button>
                      )}
                      <Button variant="outlined">Message</Button>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Tabs */}
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                <Tab label="Posts" />
                <Tab label="About" />
                <Tab label="Friends" />
                <Tab label="Photos" />
              </Tabs>
            </CardContent>
          </Card>

          {/* Content */}
          {tabValue === 0 && (
            <Box>
              {isOwnProfile && <CreatePost />}
              {feed.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </Box>
          )}
          {tabValue === 1 && (
            <Card sx={{ p: 3, borderRadius: '8px' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>About</Typography>
              {profileUser?.bio && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {profileUser.bio}
                </Typography>
              )}
              {profileUser?.location && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Location: {profileUser.location}
                </Typography>
              )}
              {profileUser?.work && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Work: {profileUser.work}
                </Typography>
              )}
              {profileUser?.education && (
                <Typography variant="body2" color="text.secondary">
                  Education: {profileUser.education}
                </Typography>
              )}
            </Card>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Profile;
