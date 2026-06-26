'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper, IconButton } from '@mui/material';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';

export default function SortableBlock({ id, children, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    marginBottom: '20px',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Paper
        elevation={isDragging ? 4 : 1}
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 2,
          border: '1px solid #e5eaef',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            borderColor: '#b4c2d6',
          },
        }}
      >
        {/* Drag handle area on the left */}
        <Box
          {...attributes}
          {...listeners}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            backgroundColor: '#F8FAFC',
            borderRight: '1px solid #e5eaef',
            cursor: 'grab',
            color: '#7C8FAC',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#F1F5F9',
              color: '#1A4FD6',
            },
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <IconGripVertical size={20} />
        </Box>

        {/* Content area in the middle */}
        <Box sx={{ flex: 1, p: 3, minWidth: 0 }}>
          {children}
        </Box>

        {/* Action area on the right (delete button) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            p: 2,
            backgroundColor: '#F8FAFC',
            borderLeft: '1px solid #e5eaef',
          }}
        >
          <IconButton
            size="small"
            color="error"
            onClick={() => onRemove(id)}
            title="Remove block"
            sx={{
              backgroundColor: '#fff',
              border: '1px solid #e5eaef',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              '&:hover': {
                backgroundColor: '#FDEDE8',
                borderColor: '#FA896B',
              },
            }}
          >
            <IconTrash size={16} />
          </IconButton>
        </Box>
      </Paper>
    </div>
  );
}
