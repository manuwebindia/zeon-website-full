'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { IconListTree } from '@tabler/icons-react';
import { extractHeadings } from '@/lib/tocUtils';

export default function TocPreview({ content = [] }) {
  const headings = useMemo(() => extractHeadings(content), [content]);

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconListTree size={18} color="#1A4FD6" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Table of Contents
        </Typography>
      </Box>

      {headings.length === 0 ? (
        <Box
          sx={{
            py: 3,
            textAlign: 'center',
            border: '1px dashed #d0d9e8',
            borderRadius: 2,
            backgroundColor: '#FAFBFD',
          }}
        >
          <Typography variant="caption" color="text.disabled">
            Add H2 / H3 / H4 headings in your content blocks to generate a TOC.
          </Typography>
        </Box>
      ) : (
        <List dense disablePadding>
          {headings.map((h, i) => (
            <ListItem
              key={i}
              disableGutters
              sx={{
                pl: h.level === 2 ? 0 : h.level === 3 ? 2 : 4,
                py: 0.25,
                borderLeft: h.level === 2 ? '2px solid #1A4FD6' : '2px solid transparent',
              }}
            >
              <ListItemText
                primary={h.text}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    sx: {
                      fontWeight: h.level === 2 ? 600 : 400,
                      color: h.level === 2 ? '#1A4FD6' : h.level === 3 ? '#334155' : '#64748b',
                      fontSize: h.level === 4 ? '0.78rem' : '0.875rem',
                      lineHeight: 1.4,
                    },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      )}

      {headings.length > 0 && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: 'block', mt: 1.5 }}
        >
          {headings.length} heading{headings.length !== 1 ? 's' : ''} found
        </Typography>
      )}
    </Paper>
  );
}
