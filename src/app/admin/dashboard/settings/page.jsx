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
  const [authorName, setAuthorName] = React.useState('Zeon Academy');
  const [authorImage, setAuthorImage] = React.useState('');
  const [universalNoIndex, setUniversalNoIndex] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('zeon_admin_token');
        const res = await fetch('/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          setAuthorName(data.authorName || 'Zeon Academy');
          setAuthorImage(data.authorImage || '');
          setUniversalNoIndex(data.universalNoIndex || false);
          
          // Seed local storage as well for fast load fallback
          localStorage.setItem('zeon_author_name', data.authorName || 'Zeon Academy');
          localStorage.setItem('zeon_author_image', data.authorImage || '');
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
      const token = localStorage.getItem('zeon_admin_token');
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          authorName: authorName.trim(),
          authorImage: authorImage.trim(),
          universalNoIndex,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save settings');
      }

      const data = await res.json();
      
      // Update local storage so sidebar re-renders instantly
      localStorage.setItem('zeon_author_name', data.authorName);
      localStorage.setItem('zeon_author_image', data.authorImage);
      
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
          System & Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure global author profiles, indexing preferences, and bot crawl configurations.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Author Profile Settings */}
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
              <IconUser size={24} style={{ color: '#FF4444' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Author Profile Settings
              </Typography>
            </Box>
            
            {/* Live Profile Preview */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 2, backgroundColor: '#F8FAFC', borderRadius: 2 }}>
              <Avatar
                src={authorImage || '/zeon-logo.png'}
                alt={authorName}
                sx={{ width: 56, height: 56, border: '2.5px solid #FF4444', boxShadow: '0 4px 12px rgba(255,68,68,0.15)' }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                  {authorName || 'Zeon Academy'}
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
                helperText="Paste a URL for your avatar image, or leave blank to use the default Zeon logo."
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
                    boxShadow: '0 4px 12px rgba(255, 68, 68, 0.2)',
                  }}
                >
                  {saving ? 'Saving...' : 'Save Profile Settings'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* SEO & Indexing Control Settings */}
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
              <IconLock size={24} style={{ color: '#FF4444' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                SEO & Indexing Control
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Manage search engine visibility for your website. Enable this option during development to prevent search engine crawlers from indexing the site.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={universalNoIndex}
                    onChange={(e) => setUniversalNoIndex(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Universal No-Index
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      Blocks search engines globally by adding noindex, nofollow metadata and modifying robots.txt rules.
                    </Typography>
                  </Box>
                }
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
                    boxShadow: '0 4px 12px rgba(255, 68, 68, 0.2)',
                  }}
                >
                  {saving ? 'Saving...' : 'Save Indexing Settings'}
                </Button>
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
          Settings saved successfully!
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
