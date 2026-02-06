import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, CircularProgress } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import api from '../utils/api';
import { setFeed, addPost } from '../store/slices/postSlice';
import { setCurrentUser } from '../store/slices/userSlice';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { feed } = useSelector((state) => state.posts);
  const { currentUser } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const feedRef = useRef(feed);
  const inFlightRef = useRef(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    feedRef.current = feed;
  }, [feed]);

  useEffect(() => {
    fetchFeed(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/users/me');
      dispatch(setCurrentUser(response.data));
    } catch (error) {
      console.error('Fetch current user error:', error);
    }
  };

  const fetchFeed = async (pageToFetch) => {
    if (inFlightRef.current) return;
    try {
      inFlightRef.current = true;
      setLoading(true);
      const response = await api.get(`/posts/feed?page=${pageToFetch}&size=10`);
      if (pageToFetch === 0) {
        dispatch(setFeed(response.data.content));
      } else {
        // Use latest feed value (avoid stale closure issues)
        dispatch(setFeed([...(feedRef.current || []), ...response.data.content]));
      }
      setHasMore(!response.data.last);
    } catch (error) {
      console.error('Fetch feed error:', error);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    // Avoid double-fetch: if already on page 0, fetch directly; otherwise let the [page] effect fetch.
    if (page === 0) {
      fetchFeed(0);
      return;
    }
    setPage(0);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F0F2F5', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', pt: 0 }}>
        <Sidebar />
        <Container
          maxWidth="md"
          sx={{
            py: 3,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '680px' }}>
            <CreatePost onPostCreated={handlePostCreated} />
            
            {loading && feed.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {feed.map((post) => (
                  <Post key={post.id} post={post} onCommentAdded={handlePostCreated} />
                ))}
                {hasMore && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#1877F2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Container>
        <Box sx={{ width: 280 }} /> {/* Right sidebar placeholder */}
      </Box>
    </Box>
  );
};

export default Home;
