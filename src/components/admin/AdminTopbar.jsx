'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, styled, Box, IconButton, Button, Typography, Stack } from '@mui/material';
import { IconMenu, IconLogout } from '@tabler/icons-react';

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  background: theme.palette.background.paper,
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  borderBottom: '1px solid #e5eaef',
  [theme.breakpoints.up('lg')]: {
    minHeight: '70px',
  },
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.secondary,
}));

const AdminTopbar = ({ toggleMobileSidebar }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('wdk_admin_token');
    localStorage.removeItem('wdk_admin_user');
    localStorage.removeItem('wdk_admin_permissions');
    localStorage.removeItem('wdk_author_name');
    localStorage.removeItem('wdk_author_image');
    router.push('/admin');
  };

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* Mobile menu toggle hamburger */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'inline',
            },
            mr: 2,
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Website Admin Panel
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Action button: Logout */}
        <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleLogout}
            startIcon={<IconLogout size="16" />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '6px',
            }}
          >
            Logout
          </Button>
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default AdminTopbar;
