'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  IconPhoto,
  IconSearch,
  IconX,
  IconFolder,
  IconCheck,
} from '@tabler/icons-react';

export default function MediaPickerDialog({
  open,
  onClose,
  onSelect,
  selectedUrl = '',
  title = 'Choose from Media Library',
  defaultFolder = 'all',
}) {
  const [mediaItems, setMediaItems] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(defaultFolder);

  // Sync defaultFolder when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedFolder(defaultFolder || 'all');
      setSearchQuery('');
    }
  }, [open, defaultFolder]);

  useEffect(() => {
    const fetchMedia = async () => {
      if (!open) return;

      setLoadingMedia(true);
      try {
        const token = localStorage.getItem('zeon_admin_token');
        const res = await fetch('/api/admin/media', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMediaItems(data.media || []);
        }
      } catch (err) {
        console.error('Failed to fetch media items:', err);
      } finally {
        setLoadingMedia(false);
      }
    };

    fetchMedia();
  }, [open]);

  // Compute folder counts
  const folderCounts = useMemo(() => {
    const counts = { all: mediaItems.length, gallery: 0, blog: 0, pages: 0 };
    mediaItems.forEach((item) => {
      const f = (item.folder || 'other').toLowerCase();
      counts[f] = (counts[f] || 0) + 1;
    });
    return counts;
  }, [mediaItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) => {
      // Folder filter
      if (selectedFolder !== 'all') {
        const itemFolder = (item.folder || '').toLowerCase();
        if (itemFolder !== selectedFolder.toLowerCase()) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (item.name || '').toLowerCase().includes(query);
        const matchesUrl = (item.url || '').toLowerCase().includes(query);
        if (!matchesName && !matchesUrl) return false;
      }

      return true;
    });
  }, [mediaItems, selectedFolder, searchQuery]);

  const handleSelect = (url) => {
    onSelect(url);
    onClose();
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Dialog Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid #eff2f7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
            }}
          >
            <IconPhoto size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Browse across existing gallery photos, blog images, and site assets
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#64748b' }}>
          <IconX size={20} />
        </IconButton>
      </Box>

      {/* Filter & Search Toolbar */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Folder Filter Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <Chip
            icon={<IconFolder size={14} />}
            label={`All (${folderCounts.all})`}
            size="small"
            clickable
            color={selectedFolder === 'all' ? 'primary' : 'default'}
            variant={selectedFolder === 'all' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFolder('all')}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`Gallery (${folderCounts.gallery || 0})`}
            size="small"
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
            size="small"
            clickable
            color={selectedFolder === 'blog' ? 'primary' : 'default'}
            variant={selectedFolder === 'blog' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFolder('blog')}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`Pages (${folderCounts.pages || 0})`}
            size="small"
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
          placeholder="Search by image name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            minWidth: { xs: '100%', sm: 260 },
            backgroundColor: '#fff',
            borderRadius: 1,
            '& .MuiInputBase-root': { height: 36 },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={16} style={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')} edge="end">
                    <IconX size={14} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </Box>

      {/* Dialog Body */}
      <DialogContent sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto', minHeight: 380, backgroundColor: '#fdfdfd' }}>
        {loadingMedia ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={36} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading media files...
            </Typography>
          </Box>
        ) : filteredItems.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <IconPhoto size={48} stroke={1.2} style={{ color: '#94a3b8', marginBottom: '12px' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              No Images Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {searchQuery
                ? `No images matching "${searchQuery}" in ${selectedFolder === 'all' ? 'any folder' : selectedFolder}.`
                : `No media found in the ${selectedFolder} folder.`}
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
                Show All Images
              </Button>
            )}
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Showing {filteredItems.length} of {mediaItems.length} files
              </Typography>
              {selectedUrl && (
                <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconCheck size={14} /> 1 item currently selected
                </Typography>
              )}
            </Box>

            <Grid container spacing={1.5}>
              {filteredItems.map((item, idx) => {
                const isSelected = selectedUrl === item.url;
                const folderStyle = getFolderColor(item.folder);

                return (
                  <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={item.url || idx}>
                    <Box
                      onClick={() => handleSelect(item.url)}
                      sx={{
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        transition: 'all 0.18s ease-in-out',
                        boxShadow: isSelected ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                          borderColor: isSelected ? '#2563eb' : '#94a3b8',
                        },
                      }}
                    >
                      {/* Thumbnail Container */}
                      <Box
                        sx={{
                          position: 'relative',
                          aspectRatio: '4/3',
                          backgroundImage: `url(${item.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#f1f5f9',
                        }}
                      >
                        {/* Folder Tag Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 6,
                            left: 6,
                            backgroundColor: folderStyle.bg,
                            color: folderStyle.text,
                            border: `1px solid ${folderStyle.border}`,
                            px: 0.8,
                            py: 0.2,
                            borderRadius: '4px',
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px',
                          }}
                        >
                          {item.folder || 'file'}
                        </Box>

                        {/* Selected Indicator */}
                        {isSelected && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 6,
                              right: 6,
                              backgroundColor: '#2563eb',
                              color: '#fff',
                              px: 0.8,
                              py: 0.2,
                              borderRadius: '4px',
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.3,
                            }}
                          >
                            <IconCheck size={10} stroke={3} /> SELECTED
                          </Box>
                        )}
                      </Box>

                      {/* File Details */}
                      <Box sx={{ p: 1, backgroundColor: isSelected ? '#eff6ff' : '#fff' }}>
                        <Tooltip title={item.name} arrow placement="top">
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              fontWeight: 600,
                              color: isSelected ? '#1e40af' : '#334155',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: '0.72rem',
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Tooltip>
                        {item.sizeBytes ? (
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>
                            {formatBytes(item.sizeBytes)}
                          </Typography>
                        ) : null}
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: '1px solid #eff2f7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Click any image to select it immediately
        </Typography>
        <Button variant="outlined" size="small" onClick={onClose} sx={{ textTransform: 'none', borderRadius: 1.5 }}>
          Close
        </Button>
      </Box>
    </Dialog>
  );
}
