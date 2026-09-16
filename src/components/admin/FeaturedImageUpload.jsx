'use client';

import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  IconPhotoPlus,
  IconTrash,
  IconCloudUpload,
  IconPhoto,
} from '@tabler/icons-react';
import MediaPickerDialog from '@/components/admin/MediaPickerDialog';

export default function FeaturedImageUpload({
  image,
  alt,
  onImageChange,
  onAltChange,
  label = 'Featured Image',
  altLabel = 'Featured Image Alt Text',
  pickerTitle = 'Choose Featured Image',
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local validation
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
      const token = localStorage.getItem('zeon_admin_token');
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

      onImageChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectMedia = (url) => {
    onImageChange(url);
    setMediaPickerOpen(false);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    onAltChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid #e5eaef',
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {label}
      </Typography>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Upload & Choose Zone */}
      {!image ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Dashed Dropzone */}
          <Box
            onClick={!uploading ? handleUploadClick : undefined}
            sx={{
              height: '140px',
              border: '2px dashed #b4c2d6',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: uploading ? 'default' : 'pointer',
              backgroundColor: '#F8FAFC',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: uploading ? '#F8FAFC' : '#F1F5F9',
                borderColor: uploading ? '#b4c2d6' : '#FF4444',
              },
            }}
          >
            {uploading ? (
              <CircularProgress size={32} />
            ) : (
               <>
                 <IconCloudUpload size={36} stroke={1.5} style={{ color: '#7C8FAC', marginBottom: '8px' }} />
                 <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                   Click to upload a new image
                 </Typography>
               </>
            )}
          </Box>

          {/* WordPress-Style Media Picker button */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<IconPhoto size={18} />}
            onClick={() => setMediaPickerOpen(true)}
            sx={{
              py: 1.2,
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Choose from Media Library
          </Button>
        </Box>
      ) : (
        <Box>
          {/* Image Thumbnail & Actions */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              height: '180px',
              border: '1px solid #e5eaef',
              mb: 2,
            }}
          >
            <img
              src={image}
              alt="Featured preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 1,
              }}
            >
              {/* Media Picker Trigger */}
              <IconButton
                size="small"
                onClick={() => setMediaPickerOpen(true)}
                title="Select from Media Library"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': { backgroundColor: '#fff' },
                }}
              >
                <IconPhoto size={16} style={{ color: '#FF4444' }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleUploadClick}
                title="Upload new image"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': { backgroundColor: '#fff' },
                }}
              >
                <IconPhotoPlus size={16} />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={handleRemoveImage}
                title="Remove image"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': { backgroundColor: '#fff' },
                }}
              >
                <IconTrash size={16} />
              </IconButton>
            </Box>
          </Box>

          {/* Image Alt Tag */}
          <TextField
            fullWidth
            label={altLabel}
            variant="outlined"
            size="small"
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
            helperText="Required. Describe this image for search engines and accessibility."
            required
            sx={{ mt: 1 }}
          />
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* WordPress-Style Media Library Picker Dialog */}
      <MediaPickerDialog
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedUrl={image}
        title={pickerTitle}
        defaultFolder="blog"
        onSelect={(url) => {
          onImageChange(url);
        }}
      />
    </Paper>
  );
}
