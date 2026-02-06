import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import MessageIcon from '@mui/icons-material/Message';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EventIcon from '@mui/icons-material/Event';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.users);

  const menuItems = [
    { icon: <HomeIcon />, text: 'Home', path: '/' },
    { icon: <PeopleIcon />, text: 'Friends', path: '/friends' },
    { icon: <GroupsIcon />, text: 'Groups', path: '/groups' },
    { icon: <MessageIcon />, text: 'Messenger', path: '/messenger' },
    { icon: <VideoLibraryIcon />, text: 'Watch', path: '/watch' },
    { icon: <BookmarkIcon />, text: 'Saved', path: '/saved' },
    { icon: <EventIcon />, text: 'Events', path: '/events' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      sx={{
        width: 280,
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: 64,
        bgcolor: 'white',
        borderRight: '1px solid #E4E6EB',
        overflowY: 'auto',
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate(`/profile/${currentUser?.id}`)}>
            <ListItemIcon>
              <Avatar src={currentUser?.profilePicture} sx={{ width: 32, height: 32 }} />
            </ListItemIcon>
            <ListItemText primary={currentUser?.firstName || 'User'} />
          </ListItemButton>
        </ListItem>
        <Divider />
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                bgcolor: isActive(item.path) ? '#E7F3FF' : 'transparent',
                '&:hover': { bgcolor: '#F2F2F2' },
                '& .MuiListItemIcon-root': {
                  color: isActive(item.path) ? '#1877F2' : '#65676B',
                },
                '& .MuiListItemText-primary': {
                  color: isActive(item.path) ? '#1877F2' : '#050505',
                  fontWeight: isActive(item.path) ? 600 : 400,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
