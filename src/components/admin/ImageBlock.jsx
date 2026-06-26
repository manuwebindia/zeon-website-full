'use client';

import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { IconPhoto, IconTrash, IconCloudUpload, IconRefresh } from '@tabler/icons-react';

export default function ImageBlock({ src, alt, caption, onUpdate }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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

    try {
      const token = localStorage.getItem('wdk_admin_token');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUpdate({ src: data.url, alt, caption });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onUpdate({ src: '', alt: '', caption: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ border: '1px solid #DFE5EF', borderRadius: '6px', p: 3, backgroundColor: '#ffffff' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {!src ? (
        // Empty image upload zone
        <Box
          onClick={!uploading ? handleUploadClick : undefined}
          sx={{
            height: '200px',
            border: '2px dashed #b4c2d6',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: uploading ? 'default' : 'pointer',
            backgroundColor: '#F8FAFC',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: uploading ? '#F8FAFC' : '#F1F5F9',
              borderColor: uploading ? '#b4c2d6' : '#1A4FD6',
            },
          }}
        >
          {uploading ? (
            <CircularProgress size={36} />
          ) : (
            <>
              <IconCloudUpload size={44} stroke={1.5} style={{ color: '#7C8FAC', marginBottom: '8px' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Drag & Drop or Click to Upload Content Image
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                PNG, JPG, WEBP, GIF up to 5MB (processed to WebP automatically)
              </Typography>
            </>
          )}
        </Box>
      ) : (
        // Loaded image block display
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Thumbnail preview */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '100%', md: '260px' },
              height: '180px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid #e5eaef',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={src}
              alt="Content block preview"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                gap: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={handleUploadClick}
                title="Replace image"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': { backgroundColor: '#fff' },
                }}
              >
                <IconRefresh size={14} />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={handleClear}
                title="Clear image"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': { backgroundColor: '#fff' },
                }}
              >
                <IconTrash size={14} />
              </IconButton>
            </Box>
          </Box>

          {/* Properties Inputs */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Image Alt Text"
              variant="outlined"
              size="small"
              value={alt || ''}
              onChange={(e) => onUpdate({ src, alt: e.target.value, caption })}
              helperText="Describe the image content for screen readers and search crawlers."
              required
            />
            <TextField
              fullWidth
              label="Caption"
              variant="outlined"
              size="small"
              value={caption || ''}
              onChange={(e) => onUpdate({ src, alt, caption: e.target.value })}
              helperText="Optional. Will display directly underneath the image on the public page."
            />
          </Box>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
