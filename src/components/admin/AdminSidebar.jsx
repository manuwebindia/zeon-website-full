'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery, Box, Drawer, Avatar, Typography, IconButton } from '@mui/material';
import {
  Logo,
  Sidebar as MUISidebar,
  MenuItem,
} from 'react-mui-sidebar';
import {
  IconLayoutDashboard,
  IconPlus,
  IconWorld,
  IconSettings,
  IconChartLine,
  IconCalendarTime,
  IconPuzzle,
  IconFiles,
  IconFileText,
  IconPhoto,
  IconUsers,
  IconShield,
  IconMap,
  IconChevronLeft,
  IconChevronRight,
  IconMessage,
  IconChartBar,
  IconMail,
} from '@tabler/icons-react';

// ── Permission helpers ────────────────────────────────────────────────────────
function getPermissions() {
  try {
    const raw = typeof window !== 'undefined'
      ? localStorage.getItem('wdk_admin_permissions')
      : '[]';
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

function getLoggedInUser() {
  try {
    const raw = typeof window !== 'undefined'
      ? localStorage.getItem('wdk_admin_user')
      : '{}';
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

function can(key) {
  const perms = getPermissions();
  return perms.includes('*') || perms.includes(key);
}

// ── Component ─────────────────────────────────────────────────────────────────
const AdminSidebar = ({ isMobileSidebarOpen, onSidebarClose, isCollapsed, toggleSidebarCollapse }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const pathname = usePathname();
  const sidebarWidth = isCollapsed ? '80px' : '270px';

  // Force re-render when permissions change (e.g. after login event)
  const [permsKey, setPermsKey] = React.useState(0);

  React.useEffect(() => {
    // Refresh permissions display on storage_update event (fired by settings save)
    const handleUpdate = () => setPermsKey((k) => k + 1);
    window.addEventListener('storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const scrollbarStyles = {
    '&::-webkit-scrollbar': { width: '7px' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: '#eff2f7', borderRadius: '15px' },
  };

  const SidebarContent = () => {
    // Read inside the component so re-renders pick up fresh values
    const user = getLoggedInUser();
    const displayName = user.displayName || user.username || 'WDK Admin';
    const avatarUrl = user.avatarUrl || '';

    // ── Chatbot Leads badge (new leads count) ──────────────────────────────
    const [newLeadsCount, setNewLeadsCount] = React.useState(0);
    React.useEffect(() => {
      if (!can('chatbot-leads.view')) return;
      const token = typeof window !== 'undefined' ? localStorage.getItem('wdk_admin_token') : '';
      if (!token) return;
      const fetchCount = async () => {
        try {
          const res = await fetch('/api/admin/chatbot-leads/count', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setNewLeadsCount(data.count ?? 0);
          }
        } catch {
          // silently fail — badge is non-critical
        }
      };
      fetchCount();
      const interval = setInterval(fetchCount, 60_000);
      return () => clearInterval(interval);
    }, []);

    // ── Contact Leads badge (new leads count) ──────────────────────────────
    const [newContactCount, setNewContactCount] = React.useState(0);
    React.useEffect(() => {
      if (!can('contact-leads.view')) return;
      const token = typeof window !== 'undefined' ? localStorage.getItem('wdk_admin_token') : '';
      if (!token) return;
      const fetchCount = async () => {
        try {
          const res = await fetch('/api/admin/contact-leads/count', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setNewContactCount(data.count ?? 0);
          }
        } catch { /* non-critical */ }
      };
      fetchCount();
      const interval = setInterval(fetchCount, 60_000);
      return () => clearInterval(interval);
    }, []);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <MUISidebar
          width="100%"
          showProfile={false}
          themeColor="#1A4FD6"
          themeSecondaryColor="#17C653"
          style={{ flexGrow: 1 }}
        >
          {/* Logo */}
          <Box sx={{ px: 2, py: 3, display: 'flex', justifyContent: 'center' }}>
            <TypographyVariantWrapper isCollapsed={isCollapsed} />
          </Box>

          {/* ── Always visible ─────────────────────── */}
          {can('dashboard.view') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/overview'}
                borderRadius="8px"
                icon={<IconLayoutDashboard stroke={1.5} size="1.3rem" />}
                link="/admin/dashboard/overview"
                component={Link}
              >
                {!isCollapsed && "Dashboard"}
              </MenuItem>
            </Box>
          )}

          {/* ── Blogs ──────────────────────────────── */}
          {can('blogs.view') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard'}
                borderRadius="8px"
                icon={<IconFileText stroke={1.5} size="1.3rem" />}
                link="/admin/dashboard"
                component={Link}
              >
                {!isCollapsed && "All Blogs"}
              </MenuItem>
            </Box>
          )}

          {can('blogs.create') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/blogs/new'}
                borderRadius="8px"
                icon={<IconPlus stroke={1.5} size="1.3rem" />}
                link="/admin/dashboard/blogs/new"
                component={Link}
              >
                {!isCollapsed && "New Post"}
              </MenuItem>
            </Box>
          )}

          {/* ── Media ──────────────────────────────── */}
          {can('media.view') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/media'}
                borderRadius="8px"
                icon={<IconPhoto stroke={1.5} size="1.3rem" />}
                link="/admin/dashboard/media"
                component={Link}
              >
                {!isCollapsed && "Media Library"}
              </MenuItem>
            </Box>
          )}

          {/* ── Chatbot Leads ───────────────────────── */}
          {can('chatbot-leads.view') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/chatbot-leads'}
                borderRadius="8px"
                icon={
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <IconMessage stroke={1.5} size="1.3rem" />
                    {newLeadsCount > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -6,
                          right: -8,
                          minWidth: 16,
                          height: 16,
                          borderRadius: '8px',
                          backgroundColor: '#EF4444',
                          color: '#fff',
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: '3px',
                          lineHeight: 1,
                        }}
                      >
                        {newLeadsCount > 99 ? '99+' : newLeadsCount}
                      </Box>
                    )}
                  </Box>
                }
                link="/admin/dashboard/chatbot-leads"
                component={Link}
              >
                {!isCollapsed && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'space-between' }}>
                    <span>Chatbot Leads</span>
                    {newLeadsCount > 0 && (
                      <Box
                        sx={{
                          minWidth: 20,
                          height: 18,
                          borderRadius: '9px',
                          backgroundColor: '#EF4444',
                          color: '#fff',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: '5px',
                        }}
                      >
                        {newLeadsCount > 99 ? '99+' : newLeadsCount}
                      </Box>
                    )}
                  </Box>
                )}
              </MenuItem>
            </Box>
          )}

          {/* ── Chat Analytics ──────────────────────── */}
          {can('chat-analytics.view') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/chat-analytics'}
                borderRadius="8px"
                icon={<IconChartBar stroke={1.5} size="1.3rem" />}
                link="/admin/dashboard/chat-analytics"
                component={Link}
              >
                {!isCollapsed && 'Chat Analytics'}
              </MenuItem>
            </Box>
          )}

          {/* ── Contact Leads ───────────────────────── */}
          {can('contact-leads.view') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/contact-leads'}
                borderRadius="8px"
                icon={
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <IconMail stroke={1.5} size="1.3rem" />
                    {newContactCount > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -6, right: -8,
                          minWidth: 16, height: 16,
                          borderRadius: '8px',
                          backgroundColor: '#EF4444',
                          color: '#fff',
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: '3px', lineHeight: 1,
                        }}
                      >
                        {newContactCount > 99 ? '99+' : newContactCount}
                      </Box>
                    )}
                  </Box>
                }
                link="/admin/dashboard/contact-leads"
                component={Link}
              >
                {!isCollapsed && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'space-between' }}>
                    <span>Contact Leads</span>
                    {newContactCount > 0 && (
                      <Box
                        sx={{
                          minWidth: 20, height: 18,
                          borderRadius: '9px',
                          backgroundColor: '#EF4444',
                          color: '#fff',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: '5px',
                        }}
                      >
                        {newContactCount > 99 ? '99+' : newContactCount}
                      </Box>
                    )}
                  </Box>
                )}
              </MenuItem>
            </Box>
          )}

          {/* ── SEO / Sitemap ───────────────────────── */}
          {can('seo.manage') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/sitemap'}
                borderRadius="8px"
                icon={<IconMap stroke={1.5} size="1.3rem" />}
                link="/admin/dashboard/sitemap"
                component={Link}
              >
                {!isCollapsed && "Sitemap & SEO"}
              </MenuItem>
            </Box>
          )}

          {/* ── RBAC: Users ────────────────────────── */}
          {can('users.view') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/users'}
                borderRadius="8px"
                icon={<IconUsers stroke={1.5} size="1.3rem" />}
                link="/admin/dashboard/users"
                component={Link}
              >
                {!isCollapsed && "Users"}
              </MenuItem>
            </Box>
          )}

          {/* ── RBAC: Groups ───────────────────────── */}
          {can('groups.manage') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/groups'}
                borderRadius="8px"
                icon={<IconShield stroke={1.5} size="1.3rem" />}
                link="/admin/dashboard/groups"
                component={Link}
              >
                {!isCollapsed && "Groups"}
              </MenuItem>
            </Box>
          )}

          {/* ── Settings ───────────────────────────── */}
          {can('settings.view') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/settings'}
                borderRadius="8px"
                icon={<IconSettings stroke={1.5} size="1.3rem" />}
                link="/admin/dashboard/settings"
                component={Link}
              >
                {!isCollapsed && "Settings"}
              </MenuItem>
            </Box>
          )}

          {/* ── View Live Site — always visible ────── */}
          <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <IconWorld stroke={1.5} size="1.3rem" />
                {!isCollapsed && 'View Live Site'}
              </Box>
            </Link>
          </Box>


          {/* ── Divider & Coming Soon section ──────── */}
          {!isCollapsed ? (
            <Box px={3} py={1} mt={2} mb={1}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary', letterSpacing: '1px', fontSize: '0.68rem', opacity: 0.8, display: 'flex', justifyContent: 'center' }}>
                Coming Soon
              </Typography>
            </Box>
          ) : (
            <Box sx={{ borderBottom: '1px solid #eff2f7', my: 2, mx: 2 }} />
          )}

          {/* ── Pages (Coming Soon) ─────────────────── */}
          <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
            <MenuItem
              isSelected={false}
              borderRadius="8px"
              icon={<IconFiles stroke={1.5} size="1.3rem" />}
              link="/admin/dashboard/settings"
              component={Link}
            >
              {!isCollapsed && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>All Pages</span>
                  <span style={{ fontSize: '0.62rem', backgroundColor: '#EFF6FF', color: '#1A4FD6', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>SOON</span>
                </Box>
              )}
            </MenuItem>
          </Box>

          {/* ── Analytics (Coming Soon) ─────────────── */}
          {can('analytics.view') && (
            <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
              <MenuItem
                isSelected={pathname === '/admin/dashboard/insights'}
                borderRadius="8px"
                icon={<IconChartLine stroke={1.5} size="1.3rem" />}
                link="/admin/dashboard/settings"
                component={Link}
              >
                {!isCollapsed && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>Insights</span>
                    <span style={{ fontSize: '0.62rem', backgroundColor: '#EFF6FF', color: '#1A4FD6', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>SOON</span>
                  </Box>
                )}
              </MenuItem>
            </Box>
          )}

          {/* ── Scheduler (Coming Soon) ─────────────── */}
          <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
            <MenuItem
              isSelected={pathname === '/admin/dashboard/scheduler'}
              borderRadius="8px"
              icon={<IconCalendarTime stroke={1.5} size="1.3rem" />}
              link="/admin/dashboard/settings"
              component={Link}
            >
              {!isCollapsed && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>Scheduler</span>
                  <span style={{ fontSize: '0.62rem', backgroundColor: '#EFF6FF', color: '#1A4FD6', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>SOON</span>
                </Box>
              )}
            </MenuItem>
          </Box>

          {/* ── Plugins (Coming Soon) ───────────────── */}
          <Box px={isCollapsed ? 1.5 : 3} mb={1} sx={isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}>
            <MenuItem
              isSelected={false}
              borderRadius="8px"
              icon={<IconPuzzle stroke={1.5} size="1.3rem" />}
              link="/admin/dashboard/settings"
              component={Link}
            >
              {!isCollapsed && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>Plugins</span>
                  <span style={{ fontSize: '0.62rem', backgroundColor: '#EFF6FF', color: '#1A4FD6', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>SOON</span>
                </Box>
              )}
            </MenuItem>
          </Box>
        </MUISidebar>

        {/* ── Logged-in user profile (bottom widget) ── */}
        <Box sx={{ mt: 'auto', p: isCollapsed ? 1.5 : 3, borderTop: '1px solid #eff2f7', display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: 1.5, background: '#F8FAFC' }}>
          <Avatar
            src={avatarUrl || '/Webdesignerkerala_logo_color.webp'}
            alt={displayName}
            sx={{ width: 40, height: 40, border: '2px solid #1A4FD6', boxShadow: '0 2px 8px rgba(26,79,214,0.1)' }}
          />
          {!isCollapsed && (
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.825rem', lineHeight: 1.2 }}>
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {user.groupName || 'Administrator'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  if (lgUp) {
    return (
      <Box sx={{ width: sidebarWidth, flexShrink: 0, transition: 'width 0.2s', position: 'relative' }}>
        <Drawer
          anchor="left"
          open={true}
          variant="permanent"
          slotProps={{
            paper: {
              sx: {
                boxSizing: 'border-box',
                ...scrollbarStyles,
                width: sidebarWidth,
                borderRight: '1px solid #e5eaef',
                transition: 'width 0.2s',
                overflow: 'visible',
              },
            },
          }}
        >
          <Box sx={{ height: '100%', position: 'relative' }}>
            <SidebarContent />
          </Box>
        </Drawer>

        {/* Floating absolute sidebar collapse button */}
        <IconButton
          onClick={toggleSidebarCollapse}
          size="small"
          sx={{
            position: 'absolute',
            right: '-14px',
            top: '24px',
            zIndex: 1201, // Float above fixed Drawer (default zIndex 1200)
            color: 'primary.main',
            border: '1px solid #e5eaef',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            width: 28,
            height: 28,
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
          }}
        >
          {isCollapsed ? <IconChevronRight size="16" /> : <IconChevronLeft size="16" />}
        </IconButton>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      slotProps={{
        paper: {
          sx: { boxShadow: (theme) => theme.shadows[8], ...scrollbarStyles, width: sidebarWidth },
        },
      }}
    >
      <Box sx={{ height: '100%' }}>
        <SidebarContent />
      </Box>
    </Drawer>
  );
};

const TypographyVariantWrapper = ({ isCollapsed }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
      <span
        style={{
          fontSize: isCollapsed ? '1.5rem' : '1.25rem',
          fontWeight: 800,
          letterSpacing: '0.5px',
          background: 'linear-gradient(90deg, #1A4FD6 0%, #17C653 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {isCollapsed ? "W" : "WDK ADMIN"}
      </span>
    </Link>
  </Box>
);

export default AdminSidebar;
