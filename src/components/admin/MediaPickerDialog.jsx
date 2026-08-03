'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
} from '@mui/material';
import { IconPhoto } from '@tabler/icons-react';

export default function MediaPickerDialog({
  open,
  onClose,
  onSelect,
  selectedUrl = '',
  title = 'Choose from Media Library',
}) {
  const [mediaItems, setMediaItems] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

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

  const handleSelect = (url) => {
    onSelect(url);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 4, overflow: 'hidden' } },
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
          {title}
        </Typography>
        <Button variant="text" size="small" onClick={onClose} sx={{ textTransform: 'none' }}>
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
              Upload images in the Media Library first, then select them here.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {mediaItems.map((item, idx) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.url || idx}>
                <Box
                  onClick={() => handleSelect(item.url)}
                  sx={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundImage: `url(${item.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#f1f5f9',
                    border: selectedUrl === item.url ? '3px solid #FF4444' : '1px solid #e5eaef',
                    cursor: 'pointer',
                    boxShadow: selectedUrl === item.url ? '0 4px 12px rgba(255,68,68,0.15)' : 'none',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  {selectedUrl === item.url && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: '#FF4444',
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
  );
}
