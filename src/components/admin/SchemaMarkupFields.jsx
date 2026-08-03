'use client';

import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import {
  IconChevronDown,
  IconSchema,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { createEmptySchemaBlock } from '@/lib/schemaBlocks';

const ARTICLE_TYPES = [
  { value: 'Article', label: 'Article (Standard Blog Post)' },
  { value: 'FAQPage', label: 'FAQ Page (Accordion Rich Results)' },
  { value: 'HowTo', label: 'How-To Guide (Step-by-Step Rich Results)' },
];

function SchemaBlockEditor({ block, index, canRemove, onUpdate, onRemove }) {
  const faqItems = Array.isArray(block.faqItems) ? block.faqItems : [];
  const howToSteps = Array.isArray(block.howToSteps) ? block.howToSteps : [];

  const updateBlock = (changes) => onUpdate(index, { ...block, ...changes });

  const updateFaqItem = (itemIndex, field, value) => {
    const updated = faqItems.map((item, i) =>
      i === itemIndex ? { ...item, [field]: value } : item
    );
    updateBlock({ faqItems: updated });
  };

  const updateHowToStep = (stepIndex, field, value) => {
    const updated = howToSteps.map((step, i) =>
      i === stepIndex ? { ...step, [field]: value } : step
    );
    updateBlock({ howToSteps: updated });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e5eaef',
        borderRadius: 2,
        p: 2.5,
        backgroundColor: '#FAFBFD',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Schema #{index + 1}
        </Typography>
        {canRemove && (
          <IconButton
            size="small"
            color="error"
            onClick={() => onRemove(index)}
            title="Remove schema"
          >
            <IconTrash size={16} />
          </IconButton>
        )}
      </Box>

      <FormControl fullWidth sx={{ mb: block.type === 'Article' ? 0 : 2 }}>
        <InputLabel>Schema Type</InputLabel>
        <Select
          value={block.type || 'Article'}
          label="Schema Type"
          onChange={(e) => {
            const nextType = e.target.value;
            updateBlock({
              type: nextType,
              faqItems: nextType === 'FAQPage' ? faqItems : [],
              howToSteps: nextType === 'HowTo' ? howToSteps : [],
            });
          }}
        >
          {ARTICLE_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {block.type === 'FAQPage' && (
        <Box>
          {faqItems.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
              No FAQ items yet. Add your first question below.
            </Typography>
          )}

          {faqItems.map((item, itemIndex) => (
            <Box
              key={`${block.id}-faq-${itemIndex}`}
              sx={{
                border: '1px solid #e5eaef',
                borderRadius: 2,
                p: 2,
                mb: 2,
                backgroundColor: '#fff',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#7C8FAC', textTransform: 'uppercase' }}>
                  FAQ #{itemIndex + 1}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    updateBlock({ faqItems: faqItems.filter((_, i) => i !== itemIndex) })
                  }
                >
                  <IconTrash size={16} />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                label="Question"
                variant="outlined"
                size="small"
                value={item.question || ''}
                onChange={(e) => updateFaqItem(itemIndex, 'question', e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                label="Answer"
                variant="outlined"
                size="small"
                multiline
                rows={2}
                value={item.answer || ''}
                onChange={(e) => updateFaqItem(itemIndex, 'answer', e.target.value)}
              />
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<IconPlus size={16} />}
            onClick={() => updateBlock({ faqItems: [...faqItems, { question: '', answer: '' }] })}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Add FAQ Item
          </Button>
        </Box>
      )}

      {block.type === 'HowTo' && (
        <Box>
          {howToSteps.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
              No steps yet. Add your first step below.
            </Typography>
          )}

          {howToSteps.map((step, stepIndex) => (
            <Box
              key={`${block.id}-step-${stepIndex}`}
              sx={{
                border: '1px solid #e5eaef',
                borderRadius: 2,
                p: 2,
                mb: 2,
                backgroundColor: '#fff',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#7C8FAC', textTransform: 'uppercase' }}>
                  Step {stepIndex + 1}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    updateBlock({ howToSteps: howToSteps.filter((_, i) => i !== stepIndex) })
                  }
                >
                  <IconTrash size={16} />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                label="Step Name"
                variant="outlined"
                size="small"
                value={step.name || ''}
                onChange={(e) => updateHowToStep(stepIndex, 'name', e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                label="Step Description"
                variant="outlined"
                size="small"
                multiline
                rows={2}
                value={step.text || ''}
                onChange={(e) => updateHowToStep(stepIndex, 'text', e.target.value)}
              />
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<IconPlus size={16} />}
            onClick={() => updateBlock({ howToSteps: [...howToSteps, { name: '', text: '' }] })}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Add Step
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default function SchemaMarkupFields({ schemaBlocks = [], onChange }) {
  const blocks = Array.isArray(schemaBlocks) && schemaBlocks.length > 0
    ? schemaBlocks
    : [createEmptySchemaBlock('Article')];

  const updateBlocks = (nextBlocks) => onChange('schemaBlocks', nextBlocks);

  const updateBlock = (index, updatedBlock) => {
    updateBlocks(blocks.map((block, i) => (i === index ? updatedBlock : block)));
  };

  const removeBlock = (index) => {
    updateBlocks(blocks.filter((_, i) => i !== index));
  };

  const addBlock = () => {
    updateBlocks([...blocks, createEmptySchemaBlock('Article')]);
  };

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
      <AccordionSummary expandIcon={<IconChevronDown size={18} />} sx={{ px: 3, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconSchema size={20} color="#1A4FD6" />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Schema Markup
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Add multiple structured data schemas for Google Rich Results
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
            You can combine schemas on one post — for example, Article + FAQPage + HowTo. Each schema outputs its own JSON-LD block for search engines.
          </Alert>

          {blocks.map((block, index) => (
            <SchemaBlockEditor
              key={block.id || `schema-block-${index}`}
              block={block}
              index={index}
              canRemove={blocks.length > 1}
              onUpdate={updateBlock}
              onRemove={removeBlock}
            />
          ))}

          <Divider />

          <Button
            variant="contained"
            startIcon={<IconPlus size={16} />}
            onClick={addBlock}
            sx={{ alignSelf: 'flex-start', textTransform: 'none', borderRadius: 2 }}
          >
            Add Schema
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
