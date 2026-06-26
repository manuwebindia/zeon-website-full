'use client';

import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Autocomplete,
  Chip,
} from '@mui/material';

const CATEGORY_SUGGESTIONS = [
  'Web Design',
  'SEO',
  'Digital Marketing',
  'Kerala Business',
  'E-Commerce',
  'Social Media',
  'WordPress',
  'Branding',
  'Development',
  'Business Tips',
];

export default function TagCategoryFields({
  focusKeyword,
  category,
  tags,
  onChange,
  existingCategories = [],
}) {
  // Merge predefined + previously used categories (deduplicated)
  const categoryOptions = [
    ...new Set([...CATEGORY_SUGGESTIONS, ...existingCategories]),
  ].sort();

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
        Taxonomy & Focus Keyword
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Focus Keyword */}
        <Box>
          <TextField
            fullWidth
            label="Focus Keyword *"
            variant="outlined"
            value={focusKeyword || ''}
            onChange={(e) => onChange('focusKeyword', e.target.value)}
            placeholder="e.g. web designers in kerala"
            helperText="Required before publishing. The primary keyword this post should rank for in Google."
            error={!focusKeyword}
          />
        </Box>

        {/* Category */}
        <Autocomplete
          freeSolo
          options={categoryOptions}
          value={category || ''}
          onInputChange={(_, newValue) => onChange('category', newValue)}
          onChange={(_, newValue) => onChange('category', newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Category"
              variant="outlined"
              helperText="Select an existing category or type a new one."
            />
          )}
        />

        {/* Tags */}
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={Array.isArray(tags) ? tags : []}
          onChange={(_, newValue) =>
            onChange(
              'tags',
              newValue.map((t) => t.toLowerCase().trim())
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              variant="outlined"
              placeholder="Type a tag and press Enter"
              helperText="Separate tags by pressing Enter. Tags are auto-lowercased."
            />
          )}
        />
      </Box>
    </Paper>
  );
}
