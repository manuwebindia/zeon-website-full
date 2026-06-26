'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  IconPhoto,
  IconCopy,
  IconEye,
  IconPlus,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function MediaLibraryPage() {
  const [media, setMedia] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('zeon_admin_token');
      const res = await fetch('/api/admin/media', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setSnackbar({
      open: true,
      message: 'Image URL copied to clipboard!',
      severity: 'success',
    });
  };

  const handlePreviewClick = (item) => {
    setSelectedItem(item);
    setPreviewOpen(true);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Media Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View, manage, and retrieve URLs for all uploaded blog featured images and media assets.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/admin/dashboard/blogs/new"
          startIcon={<IconPlus size={18} />}
          sx={{
            py: 1.2,
            px: 2.5,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 14px 0 rgba(26,79,214,0.3)',
          }}
        >
          Upload in Post
        </Button>
      </Box>

      {/* Main Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : media.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            py: 10,
            px: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px dashed #e5eaef',
          }}
        >
          <IconPhoto size={48} stroke={1.2} style={{ color: '#7C8FAC', marginBottom: '16px' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No Uploaded Media Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Media files appear automatically here when you upload featured images in your blog posts.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {media.map((item, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
              <Paper
                elevation={1}
                sx={{
                  borderRadius: 3,
                  border: '1px solid #e5eaef',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover .media-actions': {
                    opacity: 1,
                  },
                }}
              >
                {/* Image Box */}
                <Box
                  sx={{
                    width: '100%',
                    height: '160px',
                    backgroundImage: `url(${item.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#f1f5f9',
                    position: 'relative',
                  }}
                >
                  {/* Absolute Hover Actions Overlay */}
                  <Box
                    className="media-actions"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      opacity: 0,
                      transition: 'opacity 0.25s ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      zIndex: 2,
                    }}
                  >
                    <Tooltip title="Preview Image" arrow>
                      <IconButton
                        sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#e2e8f0' } }}
                        onClick={() => handlePreviewClick(item)}
                      >
                        <IconEye size={18} style={{ color: '#1E293B' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy Image URL" arrow>
                      <IconButton
                        sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#e2e8f0' } }}
                        onClick={() => handleCopyUrl(item.url)}
                      >
                        <IconCopy size={18} style={{ color: '#1E293B' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Media Details */}
                <Box sx={{ p: 2, backgroundColor: '#fff' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      lineClamp: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      mb: 0.5,
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatBytes(item.sizeBytes)}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Image Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 4, overflow: 'hidden' }
          }
        }}
      >
        {selectedItem && (
          <DialogContent sx={{ p: 0 }}>
            {/* Image Preview */}
            <Box
              sx={{
                width: '100%',
                maxHeight: '450px',
                minHeight: '280px',
                backgroundImage: `url(${selectedItem.url})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundColor: '#0f172a',
              }}
            />

            {/* Image Details Footer */}
            <Box sx={{ p: 3, backgroundColor: '#fff' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Image Details
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    File Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedItem.name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    File URL
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedItem.url}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    File Size
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatBytes(selectedItem.sizeBytes)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    Upload Date / Time
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(selectedItem.createdAt)}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => setPreviewOpen(false)}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<IconCopy size={16} />}
                  onClick={() => handleCopyUrl(selectedItem.url)}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Copy URL
                </Button>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {/* Copy Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
