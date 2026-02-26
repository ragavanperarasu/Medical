import React from 'react';
import { AppBar, Toolbar, Box, Avatar, Container } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid #ffffff',
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Container sx={{minWidth:'100%'}}>
        <Toolbar 
          disableGutters 
          sx={{ 
            justifyContent: 'space-between',
            height: '80px' // Fixed height to accommodate the 72px logo cleanly
          }}
        >
          {/* Logo Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer' 
            }}
            onClick={() => window.location.href = '/'}
          >
            <img 
              src="/logo.svg" 
              alt="OrthoOne Logo" 
              style={{ 
                height: '72px', 
                width: 'auto',
                display: 'block'
              }} 
            />
          </Box>

          {/* User Profile Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: '#007FFF', 
                width: 40, 
                height: 40, 
                fontSize: '0.9rem',
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(0,127,255,0.2)'
              }}
            >
              AD
            </Avatar>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;