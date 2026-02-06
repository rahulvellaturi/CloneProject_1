import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, InputBase, Avatar, Badge, IconButton, Menu, MenuItem, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../store/slices/authSlice';
import api from '../utils/api';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  const { unreadCount } = useSelector((state) => state.ui);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      try {
        const response = await api.get('/users/search', { params: { q: query } });
        setSearchResults(response.data);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1877F2', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Box sx={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>facebook</Box>
        </Box>

        {/* Search */}
        <Box sx={{ position: 'relative', flex: 1, maxWidth: '600px', mx: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#65676B',
                pointerEvents: 'none',
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search Facebook"
              value={searchQuery}
              onChange={handleSearch}
              sx={{
                bgcolor: '#F0F2F5',
                borderRadius: '20px',
                pl: '40px',
                pr: '16px',
                py: '8px',
                width: '100%',
                '& input': {
                  color: '#050505',
                },
              }}
            />
            {showSearchResults && searchResults.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 1,
                  bgcolor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 1000,
                }}
              >
                {searchResults.map((user) => (
                  <Box
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#F2F2F2' },
                    }}
                  >
                    <Avatar src={user.profilePicture} sx={{ mr: 2 }} />
                    <Box>
                      <Box sx={{ fontWeight: 600 }}>{user.fullName}</Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Navigation Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              color: isActive('/') ? '#1877F2' : 'white',
              bgcolor: isActive('/') ? 'white' : 'transparent',
              '&:hover': { bgcolor: isActive('/') ? 'white' : 'rgba(255,255,255,0.1)' },
            }}
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate('/friends')}
            sx={{
              color: isActive('/friends') ? '#1877F2' : 'white',
              bgcolor: isActive('/friends') ? 'white' : 'transparent',
              '&:hover': { bgcolor: isActive('/friends') ? 'white' : 'rgba(255,255,255,0.1)' },
            }}
          >
            <PeopleIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate('/groups')}
            sx={{
              color: isActive('/groups') ? '#1877F2' : 'white',
              bgcolor: isActive('/groups') ? 'white' : 'transparent',
              '&:hover': { bgcolor: isActive('/groups') ? 'white' : 'rgba(255,255,255,0.1)' },
            }}
          >
            <GroupsIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate('/messenger')}
            sx={{
              color: isActive('/messenger') ? '#1877F2' : 'white',
              bgcolor: isActive('/messenger') ? 'white' : 'transparent',
              '&:hover': { bgcolor: isActive('/messenger') ? 'white' : 'rgba(255,255,255,0.1)' },
            }}
          >
            <Badge badgeContent={0} color="error">
              <MessageIcon />
            </Badge>
          </IconButton>
          <IconButton
            sx={{
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
            <Avatar src={currentUser?.profilePicture} sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => { navigate(`/profile/${currentUser?.id}`); handleMenuClose(); }}>
            <AccountCircleIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
            <SettingsIcon sx={{ mr: 1 }} /> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
