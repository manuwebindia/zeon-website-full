'use client';

import React, { useRef, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import { IconChevronDown, IconBrandFacebook, IconCloudUpload, IconTrash } from '@tabler/icons-react';

export default function SocialFields({
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl,
  onChange,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleOgImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('zeon_admin_token');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange('ogImage', data.url);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const ogTitleLen = (ogTitle || '').length;
  const ogDescLen = (ogDescription || '').length;

  return (
    <Accordion
      elevation={1}
      sx={{
        borderRadius: '12px !important',
        border: '1px solid #e5eaef',
        mb: 4,
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<IconChevronDown size={18} />}
        sx={{ px: 3, py: 1.5 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconBrandFacebook size={20} color="#1A4FD6" />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Social Media Sharing
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Override OG tags for Facebook, LinkedIn & Twitter
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
            Leave blank to use your SEO Title, Meta Description, and Featured Image automatically.
          </Alert>

          {/* Canonical URL */}
          <TextField
            fullWidth
            label="Canonical URL"
            variant="outlined"
            value={canonicalUrl || ''}
            onChange={(e) => onChange('canonicalUrl', e.target.value)}
            placeholder="https://admission.zeonacademy.com/blog/your-slug"
            helperText="Auto-generated from slug. Override only if republishing content from another source."
          />

          {/* OG Title */}
          <Box>
            <TextField
              fullWidth
              label="OG Title (Social Share Title)"
              variant="outlined"
              value={ogTitle || ''}
              onChange={(e) => onChange('ogTitle', e.target.value)}
              slotProps={{ htmlInput: { maxLength: 95 } }}
              helperText="Shown when shared on Facebook, LinkedIn, WhatsApp."
            />
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'right',
                mt: 0.5,
                fontWeight: 500,
                color: ogTitleLen > 80 ? 'warning.main' : 'text.secondary',
              }}
            >
              {ogTitleLen}/95 characters
            </Typography>
          </Box>

          {/* OG Description */}
          <Box>
            <TextField
              fullWidth
              label="OG Description (Social Share Description)"
              variant="outlined"
              multiline
              rows={3}
              value={ogDescription || ''}
              onChange={(e) => onChange('ogDescription', e.target.value)}
              slotProps={{ htmlInput: { maxLength: 200 } }}
              helperText="Shown as the preview text when shared on social platforms."
            />
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'right',
                mt: 0.5,
                fontWeight: 500,
                color: ogDescLen > 180 ? 'warning.main' : 'text.secondary',
              }}
            >
              {ogDescLen}/200 characters
            </Typography>
          </Box>

          {/* OG Image Upload */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              OG Image (Social Share Thumbnail)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              Recommended size: 1200x630px. Falls back to Featured Image if not set.
            </Typography>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleOgImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {ogImage ? (
              <Box>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    height: '130px',
                    border: '1px solid #e5eaef',
                    mb: 1,
                  }}
                >
                  <img
                    src={ogImage}
                    alt="OG preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<IconCloudUpload size={14} />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem' }}
                  >
                    Replace
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<IconTrash size={14} />}
                    onClick={() => onChange('ogImage', '')}
                    sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem' }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                onClick={!uploading ? () => fileInputRef.current?.click() : undefined}
                sx={{
                  height: '100px',
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
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <IconCloudUpload size={28} stroke={1.5} style={{ color: '#7C8FAC', marginBottom: '6px' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Click to upload OG image
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {uploadError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {uploadError}
              </Typography>
            )}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
