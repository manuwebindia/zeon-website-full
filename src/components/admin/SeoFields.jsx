'use client';

import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Paper,
  InputAdornment,
} from '@mui/material';

export default function SeoFields({
  seoTitle,
  seoDescription,
  slug,
  allowIndexing,
  autoSlug,
  onChange,
}) {
  const handleSlugChange = (e) => {
    const value = e.target.value;
    onChange('slug', value);
    if (autoSlug) {
      onChange('autoSlug', false); // Turn off auto slug generation once user types manually
    }
  };

  const titleLength = seoTitle ? seoTitle.length : 0;
  const descLength = seoDescription ? seoDescription.length : 0;

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
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        SEO Settings
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* URL Slug */}
        <TextField
          fullWidth
          label="URL Slug"
          variant="outlined"
          value={slug}
          onChange={handleSlugChange}
          helperText={autoSlug ? "Auto-generated from title. Edit to customize." : "Custom slug entered."}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ opacity: 0.8 }}>
                  /blog/
                </InputAdornment>
              ),
            }
          }}
        />

        {/* SEO Title */}
        <Box>
          <TextField
            fullWidth
            label="SEO Title"
            variant="outlined"
            value={seoTitle || ''}
            onChange={(e) => onChange('seoTitle', e.target.value)}
            slotProps={{
              htmlInput: { maxLength: 100 }
            }}
            helperText="The title shown in search engine result pages (SERPs)."
          />
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'right',
              mt: 0.5,
              fontWeight: 500,
              color: titleLength > 60 ? 'warning.main' : 'text.secondary',
            }}
          >
            {titleLength}/60 characters (recommended)
          </Typography>
        </Box>

        {/* SEO Meta Description */}
        <Box>
          <TextField
            fullWidth
            label="Meta Description"
            variant="outlined"
            multiline
            rows={3}
            value={seoDescription || ''}
            onChange={(e) => onChange('seoDescription', e.target.value)}
            slotProps={{
              htmlInput: { maxLength: 250 }
            }}
            helperText="The brief snippet summarizing this article in search results."
          />
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'right',
              mt: 0.5,
              fontWeight: 500,
              color: descLength > 160 ? 'warning.main' : 'text.secondary',
            }}
          >
            {descLength}/160 characters (recommended)
          </Typography>
        </Box>

        {/* Allow Search Engine Indexing */}
        <Box sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={allowIndexing}
                onChange={(e) => onChange('allowIndexing', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Allow Indexing
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  If unchecked, search engines will not index this blog post (adds a noindex tag).
                </Typography>
              </Box>
            }
          />
        </Box>
      </Box>
    </Paper>
  );
}
