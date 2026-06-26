'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { IconUser, IconLayoutSidebar, IconLock } from '@tabler/icons-react';

export default function AdminSettingsPage() {
  const [authorName, setAuthorName] = React.useState('WDK Admin');
  const [authorImage, setAuthorImage] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('wdk_admin_token');
        const res = await fetch('/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          setAuthorName(data.authorName || 'WDK Admin');
          setAuthorImage(data.authorImage || '');
          
          // Seed local storage as well for fast load fallback
          localStorage.setItem('wdk_author_name', data.authorName || 'WDK Admin');
          localStorage.setItem('wdk_author_image', data.authorImage || '');
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    
    try {
      const token = localStorage.getItem('wdk_admin_token');
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          authorName: authorName.trim(),
          authorImage: authorImage.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save settings');
      }

      const data = await res.json();
      
      // Update local storage so sidebar re-renders instantly
      localStorage.setItem('wdk_author_name', data.authorName);
      localStorage.setItem('wdk_author_image', data.authorImage);
      
      // Dispatch custom event to trigger instant live updates in components like AdminSidebar
      window.dispatchEvent(new Event('storage_update'));
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          System & Author Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure global author profiles, workspace preferences, and user roles.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Author Profile Settings — FULLY ACTIVE AND INTERACTIVE */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={1}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid #e5eaef',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <IconUser size={24} style={{ color: '#1A4FD6' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Author Profile Settings
              </Typography>
            </Box>
            
            {/* Live Profile Preview */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 2, backgroundColor: '#F8FAFC', borderRadius: 2 }}>
              <Avatar
                src={authorImage || '/Webdesignerkerala_logo_color.webp'}
                alt={authorName}
                sx={{ width: 56, height: 56, border: '2.5px solid #1A4FD6', boxShadow: '0 4px 12px rgba(26,79,214,0.15)' }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                  {authorName || 'WDK Admin'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Live Preview in Sidebar
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
              <TextField
                fullWidth
                label="Author Name"
                variant="outlined"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Manu Dev"
                helperText="Enter the name that will appear as the author on blog posts and the sidebar."
              />
              <TextField
                fullWidth
                label="Author Profile Image URL"
                variant="outlined"
                value={authorImage}
                onChange={(e) => setAuthorImage(e.target.value)}
                placeholder="e.g. https://example.com/avatar.jpg"
                helperText="Paste a URL for your avatar image, or leave blank to use the default WDK logo."
              />

              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    py: 1.4,
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(26, 79, 214, 0.2)',
                  }}
                >
                  {saving ? 'Saving...' : 'Save Profile Settings'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Sidepanel Customization — Coming Soon mockup */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={1}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid #e5eaef',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Premium Coming Soon Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(3px)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#17C653',
                  color: 'white',
                  px: 2,
                  py: 0.6,
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  mb: 1.5,
                  boxShadow: '0 4px 10px rgba(23, 198, 83, 0.25)',
                }}
              >
                Coming Soon
              </Box>
              <IconLock size={32} style={{ color: '#17C653', marginBottom: '8px' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Sidebar Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '280px' }}>
                Tailor navigation options, toggles, badges, and background styles for your dashboard.
              </Typography>
            </Box>

            {/* Locked content background view for premium appearance */}
            <Box sx={{ filter: 'blur(1.5px)', opacity: 0.6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <IconLayoutSidebar size={24} style={{ color: '#17C653' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Side Panel Customization
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch checked disabled />}
                  label="Enable Dark Sidebar Theme"
                />
                <Divider />
                <FormControlLabel
                  control={<Switch checked={false} disabled />}
                  label="Auto-collapse Side Navigation"
                />
                <Divider />
                <FormControlLabel
                  control={<Switch checked disabled />}
                  label="Show Analytics Badges Next to Menu Items"
                />
                <Divider />
                <FormControlLabel
                  control={<Switch checked disabled />}
                  label="Pin 'Create Post' to Bottom Utility Bar"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Success Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          Author Profile settings saved successfully!
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%', borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
