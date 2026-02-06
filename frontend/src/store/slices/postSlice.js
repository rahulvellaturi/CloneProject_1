import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    feed: [],
    userPosts: {},
    loading: false,
    error: null,
  },
  reducers: {
    setFeed: (state, action) => {
      state.feed = action.payload;
    },
    addPost: (state, action) => {
      state.feed.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.feed.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.feed[index] = action.payload;
      }
    },
    removePost: (state, action) => {
      state.feed = state.feed.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setFeed, addPost, updatePost, removePost, setLoading, setError } = postSlice.actions;
export default postSlice.reducer;
