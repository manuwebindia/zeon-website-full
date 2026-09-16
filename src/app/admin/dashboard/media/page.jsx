'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  IconPhoto,
  IconCopy,
  IconEye,
  IconPlus,
  IconSearch,
  IconX,
  IconFolder,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function MediaLibraryPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');

  const [snackbar, setSnackbar] = useState({
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

  useEffect(() => {
    fetchMedia();
  }, []);

  // Compute folder counts
  const folderCounts = useMemo(() => {
    const counts = { all: media.length, gallery: 0, blog: 0, pages: 0 };
    media.forEach((item) => {
      const f = (item.folder || 'other').toLowerCase();
      counts[f] = (counts[f] || 0) + 1;
    });
    return counts;
  }, [media]);

  // Filter media items
  const filteredMedia = useMemo(() => {
    return media.filter((item) => {
      if (selectedFolder !== 'all') {
        const itemFolder = (item.folder || '').toLowerCase();
        if (itemFolder !== selectedFolder.toLowerCase()) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (item.name || '').toLowerCase().includes(query);
        const matchesUrl = (item.url || '').toLowerCase().includes(query);
        if (!matchesName && !matchesUrl) return false;
      }
      return true;
    });
  }, [media, selectedFolder, searchQuery]);

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
    if (!bytes || bytes === 0) return '0 Bytes';
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

  const getFolderColor = (folder) => {
    switch ((folder || '').toLowerCase()) {
      case 'gallery':
        return { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' };
      case 'blog':
        return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
      case 'pages':
        return { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Media Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and browse media assets across gallery albums ({folderCounts.gallery || 0}), blog posts ({folderCounts.blog || 0}), and static pages ({folderCounts.pages || 0}).
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            component={Link}
            href="/admin/dashboard/gallery"
            sx={{
              py: 1,
              px: 2,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Gallery Albums
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/admin/dashboard/blogs/new"
            startIcon={<IconPlus size={18} />}
            sx={{
              py: 1,
              px: 2,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(26,79,214,0.3)',
            }}
          >
            New Blog Post
          </Button>
        </Box>
      </Box>

      {/* Filter & Search Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#fff',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Folder Filter Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <Chip
            icon={<IconFolder size={14} />}
            label={`All (${folderCounts.all})`}
            clickable
            color={selectedFolder === 'all' ? 'primary' : 'default'}
            variant={selectedFolder === 'all' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFolder('all')}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`Gallery (${folderCounts.gallery || 0})`}
            clickable
            color={selectedFolder === 'gallery' ? 'primary' : 'default'}
            variant={selectedFolder === 'gallery' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFolder('gallery')}
            sx={{
              fontWeight: 600,
              backgroundColor: selectedFolder === 'gallery' ? '#4f46e5' : undefined,
            }}
          />
          <Chip
            label={`Blog (${folderCounts.blog || 0})`}
            clickable
            color={selectedFolder === 'blog' ? 'primary' : 'default'}
            variant={selectedFolder === 'blog' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFolder('blog')}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`Pages (${folderCounts.pages || 0})`}
            clickable
            color={selectedFolder === 'pages' ? 'primary' : 'default'}
            variant={selectedFolder === 'pages' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFolder('pages')}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Search Field */}
        <TextField
          size="small"
          placeholder="Search by file name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            minWidth: { xs: '100%', sm: 280 },
            '& .MuiInputBase-root': { height: 38 },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={18} style={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')} edge="end">
                    <IconX size={16} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </Paper>

      {/* Main Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredMedia.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 10,
            px: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px dashed #e5eaef',
            backgroundColor: '#fff',
          }}
        >
          <IconPhoto size={48} stroke={1.2} style={{ color: '#7C8FAC', marginBottom: '16px' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No Media Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchQuery
              ? `No images match your search "${searchQuery}".`
              : `No files found in the selected folder.`}
          </Typography>
          {(searchQuery || selectedFolder !== 'all') && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchQuery('');
                setSelectedFolder('all');
              }}
              sx={{ textTransform: 'none' }}
            >
              Reset Filters
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 600 }}>
            Showing {filteredMedia.length} of {media.length} items
          </Typography>

          <Grid container spacing={2.5}>
            {filteredMedia.map((item, idx) => {
              const folderStyle = getFolderColor(item.folder);

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.url || idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 2.5,
                      border: '1px solid #e5eaef',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#fff',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                      },
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
                      {/* Folder Tag Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: folderStyle.bg,
                          color: folderStyle.text,
                          border: `1px solid ${folderStyle.border}`,
                          px: 0.9,
                          py: 0.25,
                          borderRadius: '4px',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          zIndex: 1,
                        }}
                      >
                        {item.folder || 'file'}
                      </Box>

                      {/* Absolute Hover Actions Overlay */}
                      <Box
                        className="media-actions"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.45)',
                          opacity: 0,
                          transition: 'opacity 0.2s ease-in-out',
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
                      <Tooltip title={item.name} arrow placement="top">
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mb: 0.5,
                            fontSize: '0.85rem',
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Tooltip>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {formatBytes(item.sizeBytes)}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {/* Image Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, overflow: 'hidden' },
          },
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
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
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
                    Folder
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {selectedItem.folder || 'Default'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    File URL
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#2563eb',
                    }}
                  >
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
