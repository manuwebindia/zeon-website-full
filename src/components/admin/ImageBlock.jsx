'use client';

import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  IconPhoto,
  IconTrash,
  IconCloudUpload,
  IconRefresh,
  IconFolder,
  IconArrowsMaximize,
  IconLayout,
  IconAspectRatio,
} from '@tabler/icons-react';
import MediaPickerDialog from '@/components/admin/MediaPickerDialog';

export default function ImageBlock({ src, alt, caption, alignment = 'full', onUpdate }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const cleanFilenameToAlt = (url) => {
    if (!url) return '';
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      return filename
        .replace(/\.[^/.]+$/, '') // remove extension
        .replace(/[-_]/g, ' ') // replace dashes/underscores with space
        .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case
    } catch {
      return '';
    }
  };

  const handleMediaSelect = (url) => {
    const suggestedAlt = alt || cleanFilenameToAlt(url);
    onUpdate({ src: url, alt: suggestedAlt, caption, alignment });
    setMediaPickerOpen(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'blog');

    try {
      const token = localStorage.getItem('zeon_admin_token');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const suggestedAlt = alt || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      onUpdate({ src: data.url, alt: suggestedAlt, caption, alignment });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onUpdate({ src: '', alt: '', caption: '', alignment: 'full' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ border: '1px solid #DFE5EF', borderRadius: 2.5, p: 3, backgroundColor: '#ffffff' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {!src ? (
        // Empty state: Media Library & Upload options
        <Box
          sx={{
            py: 5,
            px: 3,
            border: '2px dashed #cbd5e1',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
            textAlign: 'center',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#F1F5F9',
              borderColor: '#2563eb',
            },
          }}
        >
          {uploading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <CircularProgress size={36} sx={{ mb: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                Processing & optimizing image...
              </Typography>
            </Box>
          ) : (
            <>
              <IconPhoto size={44} stroke={1.3} style={{ color: '#64748b', marginBottom: '8px' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                Add Content Image
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2.5, maxWidth: 420 }}>
                Choose an existing photo from the Media Library (gallery, blog, pages) or upload a new image from your device.
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<IconFolder size={16} />}
                  onClick={() => setMediaPickerOpen(true)}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                  Choose from Media Library
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<IconCloudUpload size={16} />}
                  onClick={handleUploadClick}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                  Upload File
                </Button>
              </Box>
            </>
          )}
        </Box>
      ) : (
        // Loaded image block display & Media Settings
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Thumbnail preview */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '100%', md: '260px' },
              height: '190px',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src={src}
              alt={alt || 'Content block preview'}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
            {/* Quick Action Overlay Buttons */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                gap: 0.8,
              }}
            >
              <Tooltip title="Choose from Media Library" arrow>
                <IconButton
                  size="small"
                  onClick={() => setMediaPickerOpen(true)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    '&:hover': { backgroundColor: '#fff' },
                  }}
                >
                  <IconFolder size={15} style={{ color: '#2563eb' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Upload Replacement" arrow>
                <IconButton
                  size="small"
                  onClick={handleUploadClick}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    '&:hover': { backgroundColor: '#fff' },
                  }}
                >
                  <IconRefresh size={15} style={{ color: '#475569' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove Image" arrow>
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleClear}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    '&:hover': { backgroundColor: '#fff' },
                  }}
                >
                  <IconTrash size={15} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Media Settings Inputs */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Media Settings
              </Typography>
              <Button
                size="small"
                variant="text"
                startIcon={<IconFolder size={14} />}
                onClick={() => setMediaPickerOpen(true)}
                sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.2 }}
              >
                Browse Media
              </Button>
            </Box>

            <TextField
              fullWidth
              label="Image Alt Text"
              variant="outlined"
              size="small"
              value={alt || ''}
              onChange={(e) => onUpdate({ src, alt: e.target.value, caption, alignment })}
              helperText="Required for SEO & accessibility. Describe the image for search crawlers."
              required
            />

            <TextField
              fullWidth
              label="Caption (Optional)"
              variant="outlined"
              size="small"
              value={caption || ''}
              onChange={(e) => onUpdate({ src, alt, caption: e.target.value, alignment })}
              helperText="Optional descriptive caption displayed beneath the image on the article."
            />

            {/* Layout / Size Setting */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Display Width:
              </Typography>
              <ToggleButtonGroup
                size="small"
                value={alignment || 'full'}
                exclusive
                onChange={(e, val) => {
                  if (val) onUpdate({ src, alt, caption, alignment: val });
                }}
                sx={{ height: 32 }}
              >
                <ToggleButton value="full" sx={{ textTransform: 'none', fontSize: '0.75rem', px: 1.5, gap: 0.5 }}>
                  <IconArrowsMaximize size={14} /> Full Width
                </ToggleButton>
                <ToggleButton value="wide" sx={{ textTransform: 'none', fontSize: '0.75rem', px: 1.5, gap: 0.5 }}>
                  <IconLayout size={14} /> Centered (80%)
                </ToggleButton>
                <ToggleButton value="compact" sx={{ textTransform: 'none', fontSize: '0.75rem', px: 1.5, gap: 0.5 }}>
                  <IconAspectRatio size={14} /> Compact (60%)
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedUrl={src}
        title="Choose Content Image from Media Library"
        defaultFolder="blog"
        onSelect={handleMediaSelect}
      />
    </Box>
  );
}
