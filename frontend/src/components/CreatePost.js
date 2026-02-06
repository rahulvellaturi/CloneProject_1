import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Avatar, TextField, IconButton, Button } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useDropzone } from 'react-dropzone';
import api from '../utils/api';
import { addPost } from '../store/slices/postSlice';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        setImageFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
      }
    },
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    setLoading(true);
    try {
      let uploadedImageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadResponse = await api.post('/files/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImageUrl = uploadResponse.data.url;
      }

      const response = await api.post('/posts', {
        content,
        imageUrl: uploadedImageUrl,
      });

      dispatch(addPost(response.data));
      setContent('');
      setImageFile(null);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error('Create post error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar src={currentUser?.profilePicture} />
          <Box sx={{ flex: 1 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                placeholder={`What's on your mind, ${currentUser?.firstName}?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                maxRows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    bgcolor: '#F0F2F5',
                  },
                }}
              />

              {imagePreviewUrl && (
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <Box
                    component="img"
                    src={imagePreviewUrl}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      borderRadius: '8px',
                      maxHeight: '400px',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setImageFile(null);
                      setImagePreviewUrl(null);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    }}
                  >
                    ×
                  </IconButton>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #E4E6EB' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <IconButton
                      component="span"
                      sx={{
                        color: '#42B72A',
                        '&:hover': { bgcolor: '#F0F2F5' },
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </div>
                  <IconButton
                    sx={{
                      color: '#F02849',
                      '&:hover': { bgcolor: '#F0F2F5' },
                    }}
                  >
                    <VideocamIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: '#F7B928',
                      '&:hover': { bgcolor: '#F0F2F5' },
                    }}
                  >
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || (!content.trim() && !imageFile)}
                  sx={{
                    bgcolor: '#1877F2',
                    textTransform: 'none',
                    borderRadius: '20px',
                    px: 3,
                    '&:hover': { bgcolor: '#166FE5' },
                  }}
                >
                  Post
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
