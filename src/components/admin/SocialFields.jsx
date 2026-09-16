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
import { IconChevronDown, IconBrandFacebook, IconCloudUpload, IconTrash, IconFolder } from '@tabler/icons-react';
import MediaPickerDialog from '@/components/admin/MediaPickerDialog';

export default function SocialFields({
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl,
  onChange,
}) {
  const fileInputRef = useRef(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
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
    formData.append('folder', 'blog');

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
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
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
                    height: '140px',
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
                    startIcon={<IconFolder size={14} />}
                    onClick={() => setMediaPickerOpen(true)}
                    sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem' }}
                  >
                    Media Library
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<IconCloudUpload size={14} />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem' }}
                  >
                    Upload File
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
                sx={{
                  py: 3,
                  px: 2,
                  border: '2px dashed #b4c2d6',
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
                    borderColor: '#1A4FD6',
                  },
                }}
              >
                {uploading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1 }}>
                    <CircularProgress size={24} sx={{ mb: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Uploading image...
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <IconCloudUpload size={32} stroke={1.4} style={{ color: '#7C8FAC', marginBottom: '8px' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                      Social Share Image
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, maxWidth: 320 }}>
                      Choose an image from your Media Library or upload a new file.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<IconFolder size={14} />}
                        onClick={() => setMediaPickerOpen(true)}
                        sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: 2 }}
                      >
                        Media Library
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<IconCloudUpload size={14} />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: 2 }}
                      >
                        Upload
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}

            {uploadError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {uploadError}
              </Typography>
            )}

            <MediaPickerDialog
              open={mediaPickerOpen}
              onClose={() => setMediaPickerOpen(false)}
              selectedUrl={ogImage}
              title="Choose Social Share Image"
              defaultFolder="blog"
              onSelect={(url) => {
                onChange('ogImage', url);
                setMediaPickerOpen(false);
              }}
            />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
