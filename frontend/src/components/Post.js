import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Card, CardContent, Avatar, Typography, IconButton, TextField, Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { updatePost } from '../store/slices/postSlice';
import './Post.css';

const Post = ({ post, onCommentAdded }) => {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      const response = await api.post(`/posts/${post.id}/like`);
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
      dispatch(updatePost(response.data));
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleCommentClick = async () => {
    if (!showComments && comments.length === 0) {
      setLoading(true);
      try {
        const response = await api.get(`/comments/post/${post.id}`);
        setComments(response.data);
      } catch (error) {
        console.error('Fetch comments error:', error);
      } finally {
        setLoading(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await api.post(`/comments/post/${post.id}`, {
        content: commentText,
      });
      setComments([...comments, response.data]);
      setCommentText('');
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2, borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <CardContent>
          {/* Post Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={post.userProfilePicture} sx={{ mr: 1.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {post.userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime(post.createdAt)}
              </Typography>
            </Box>
            <IconButton size="small">
              <MoreHorizIcon />
            </IconButton>
          </Box>

          {/* Post Content */}
          {post.content && (
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              {post.content}
            </Typography>
          )}

          {/* Post Image */}
          {post.imageUrl && (
            <Box
              component="img"
              src={post.imageUrl}
              alt="Post"
              sx={{
                width: '100%',
                borderRadius: '8px',
                mb: 2,
                maxHeight: '500px',
                objectFit: 'cover',
              }}
            />
          )}

          {/* Post Video */}
          {post.videoUrl && (
            <Box
              component="video"
              src={post.videoUrl}
              controls
              sx={{
                width: '100%',
                borderRadius: '8px',
                mb: 2,
                maxHeight: '500px',
              }}
            />
          )}

          {/* Post Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {likeCount} likes
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {post.commentCount || 0} comments
            </Typography>
          </Box>

          {/* Post Actions */}
          <Box sx={{ display: 'flex', borderTop: '1px solid #E4E6EB', pt: 1, mt: 1 }}>
            <Button
              fullWidth
              startIcon={<ThumbUpIcon sx={{ color: isLiked ? '#1877F2' : '#65676B' }} />}
              onClick={handleLike}
              sx={{
                color: isLiked ? '#1877F2' : '#65676B',
                textTransform: 'none',
                '&:hover': { bgcolor: '#F2F2F2' },
              }}
            >
              Like
            </Button>
            <Button
              fullWidth
              startIcon={<CommentIcon />}
              onClick={handleCommentClick}
              sx={{
                color: '#65676B',
                textTransform: 'none',
                '&:hover': { bgcolor: '#F2F2F2' },
              }}
            >
              Comment
            </Button>
            <Button
              fullWidth
              startIcon={<ShareIcon />}
              sx={{
                color: '#65676B',
                textTransform: 'none',
                '&:hover': { bgcolor: '#F2F2F2' },
              }}
            >
              Share
            </Button>
          </Box>

          {/* Comments Section */}
          {showComments && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E4E6EB' }}>
              {comments.map((comment) => (
                <Box key={comment.id} sx={{ display: 'flex', mb: 2 }}>
                  <Avatar src={comment.userProfilePicture} sx={{ width: 32, height: 32, mr: 1 }} />
                  <Box sx={{ flex: 1, bgcolor: '#F0F2F5', borderRadius: '18px', p: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {comment.userName}
                    </Typography>
                    <Typography variant="body2">{comment.content}</Typography>
                  </Box>
                </Box>
              ))}

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit}>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Avatar sx={{ width: 32, height: 32 }} />
                  <TextField
                    fullWidth
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        bgcolor: '#F0F2F5',
                      },
                    }}
                  />
                </Box>
              </form>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Post;
