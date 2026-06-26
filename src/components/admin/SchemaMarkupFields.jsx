'use client';

import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
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
} from '@mui/material';
import {
  IconChevronDown,
  IconSchema,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';

const ARTICLE_TYPES = [
  { value: 'Article', label: 'Article (Standard Blog Post)' },
  { value: 'FAQPage', label: 'FAQ Page (Accordion Rich Results)' },
  { value: 'HowTo', label: 'How-To Guide (Step-by-Step Rich Results)' },
];

export default function SchemaMarkupFields({
  articleType = 'Article',
  schemaFaqItems = [],
  schemaHowToSteps = [],
  onChange,
}) {
  const faqItems = Array.isArray(schemaFaqItems) ? schemaFaqItems : [];
  const howToSteps = Array.isArray(schemaHowToSteps) ? schemaHowToSteps : [];

  // FAQ handlers
  const addFaqItem = () => {
    onChange('schemaFaqItems', [...faqItems, { question: '', answer: '' }]);
  };

  const updateFaqItem = (index, field, value) => {
    const updated = faqItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange('schemaFaqItems', updated);
  };

  const removeFaqItem = (index) => {
    onChange('schemaFaqItems', faqItems.filter((_, i) => i !== index));
  };

  // HowTo handlers
  const addHowToStep = () => {
    onChange('schemaHowToSteps', [
      ...howToSteps,
      { name: '', text: '' },
    ]);
  };

  const updateHowToStep = (index, field, value) => {
    const updated = howToSteps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    );
    onChange('schemaHowToSteps', updated);
  };

  const removeHowToStep = (index) => {
    onChange('schemaHowToSteps', howToSteps.filter((_, i) => i !== index));
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
      <AccordionSummary
        expandIcon={<IconChevronDown size={18} />}
        sx={{ px: 3, py: 1.5 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconSchema size={20} color="#1A4FD6" />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Schema Markup
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Structured data for Google Rich Results
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
            Schema data is hidden from readers — only Google and search engines see it. Use FAQ or HowTo to unlock rich search result previews.
          </Alert>

          {/* Article Type Selector */}
          <FormControl fullWidth>
            <InputLabel>Article Type</InputLabel>
            <Select
              value={articleType || 'Article'}
              label="Article Type"
              onChange={(e) => onChange('articleType', e.target.value)}
            >
              {ARTICLE_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* FAQ Items — shown when articleType is FAQPage */}
          {articleType === 'FAQPage' && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                FAQ Items
              </Typography>

              {faqItems.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                  No FAQ items yet. Add your first question below.
                </Typography>
              )}

              {faqItems.map((item, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      border: '1px solid #e5eaef',
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                      backgroundColor: '#FAFBFD',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#7C8FAC', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        FAQ #{index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFaqItem(index)}
                        title="Remove FAQ item"
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
                      onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                      placeholder="e.g. How much does a website cost in Kerala?"
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
                      onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                      placeholder="Provide a clear, concise answer..."
                    />
                  </Box>
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<IconPlus size={16} />}
                onClick={addFaqItem}
                sx={{ textTransform: 'none', borderRadius: 2, mt: 1 }}
              >
                Add FAQ Item
              </Button>
            </Box>
          )}

          {/* HowTo Steps — shown when articleType is HowTo */}
          {articleType === 'HowTo' && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                How-To Steps
              </Typography>

              {howToSteps.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                  No steps yet. Add your first step below.
                </Typography>
              )}

              {howToSteps.map((step, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      border: '1px solid #e5eaef',
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                      backgroundColor: '#FAFBFD',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#7C8FAC', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Step {index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeHowToStep(index)}
                        title="Remove step"
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
                      onChange={(e) => updateHowToStep(index, 'name', e.target.value)}
                      placeholder="e.g. Choose your domain name"
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
                      onChange={(e) => updateHowToStep(index, 'text', e.target.value)}
                      placeholder="Describe what to do in this step..."
                    />
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 1 }} />

              <Button
                variant="outlined"
                startIcon={<IconPlus size={16} />}
                onClick={addHowToStep}
                sx={{ textTransform: 'none', borderRadius: 2, mt: 1 }}
              >
                Add Step
              </Button>
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
