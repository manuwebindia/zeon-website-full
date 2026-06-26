'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  Grid,
} from '@mui/material';
import {
  IconPhotoPlus,
  IconTrash,
  IconCloudUpload,
  IconPhoto,
} from '@tabler/icons-react';

export default function FeaturedImageUpload({
  image,
  alt,
  onImageChange,
  onAltChange,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Fetch uploads on open
  useEffect(() => {
    const fetchMedia = async () => {
      if (!mediaPickerOpen) return;
      
      setLoadingMedia(true);
      try {
        const token = localStorage.getItem('wdk_admin_token');
        const res = await fetch('/api/admin/media', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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
  }, [mediaPickerOpen]);

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
        Featured Image
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
                borderColor: uploading ? '#b4c2d6' : '#1A4FD6',
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
                <IconPhoto size={16} style={{ color: '#1A4FD6' }} />
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
            label="Featured Image Alt Text"
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
      <Dialog
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 4, overflow: 'hidden' }
          }
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid #eff2f7',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Choose Featured Image
          </Typography>
          <Button variant="text" size="small" onClick={() => setMediaPickerOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
        </Box>

        <DialogContent sx={{ p: 3, minHeight: '350px', maxHeight: '500px', overflowY: 'auto' }}>
          {loadingMedia ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : mediaItems.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <IconPhoto size={48} stroke={1.2} style={{ color: '#7C8FAC', marginBottom: '16px' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                No Uploaded Media Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload a featured image first to seed your media library folder on the server.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {mediaItems.map((item, idx) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={idx}>
                  <Box
                    onClick={() => handleSelectMedia(item.url)}
                    sx={{
                      position: 'relative',
                      aspectRatio: '16/9',
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundImage: `url(${item.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#f1f5f9',
                      border: image === item.url ? '3px solid #1A4FD6' : '1px solid #e5eaef',
                      cursor: 'pointer',
                      boxShadow: image === item.url ? '0 4px 12px rgba(26,79,214,0.15)' : 'none',
                      transition: 'all 0.15s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    {image === item.url && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: '#1A4FD6',
                          color: '#fff',
                          px: 1,
                          py: 0.2,
                          borderRadius: '4px',
                          fontSize: '0.6rem',
                          fontWeight: 700,
                        }}
                      >
                        SELECTED
                      </Box>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      mt: 0.5,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
