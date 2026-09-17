'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { styled, Container, Box, CircularProgress } from '@mui/material';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'transparent',
}));

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zeon_sidebar_collapsed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('zeon_admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      // Client-side expiry check (server still verifies on every API call)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          // Token expired (6 hours passed) — clear all keys and redirect
          ['zeon_admin_token', 'zeon_admin_user', 'zeon_admin_permissions',
           'zeon_author_name', 'zeon_author_image'].forEach((k) =>
            localStorage.removeItem(k)
          );
          router.push('/admin');
          return;
        }
      } catch {
        // Malformed token
        localStorage.removeItem('zeon_admin_token');
        router.push('/admin');
        return;
      }

      setCheckingAuth((prev) => (prev ? false : prev));
    };

    const timer = setTimeout(checkTokenExpiry, 0);
    const expiryInterval = setInterval(checkTokenExpiry, 30_000);
    return () => {
      clearTimeout(timer);
      clearInterval(expiryInterval);
    };
  }, [router]);

  const toggleSidebarCollapse = () => {
    const newVal = !isSidebarCollapsed;
    setIsSidebarCollapsed(newVal);
    localStorage.setItem('zeon_sidebar_collapsed', String(newVal));
  };

  if (checkingAuth) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainWrapper className="mainwrapper">
      {/* Sidebar Drawer */}
      <AdminSidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        toggleSidebarCollapse={toggleSidebarCollapse}
      />

      {/* Main Content Wrapper */}
      <PageWrapper className="page-wrapper">
        {/* Topbar/Header */}
        <AdminTopbar
          toggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Page Content Container */}
        <Container
          sx={{
            paddingTop: '30px',
            paddingBottom: '30px',
            maxWidth: '1200px',
          }}
        >
          <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
