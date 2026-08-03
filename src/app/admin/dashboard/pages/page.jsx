'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import Link from 'next/link';
import {
  IconFiles,
  IconExternalLink,
  IconDeviceFloppy,
  IconRefresh,
  IconArrowBack,
} from '@tabler/icons-react';
import SeoFields from '@/components/admin/SeoFields';
import SocialFields from '@/components/admin/SocialFields';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('zeon_admin_token') : '';
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

const EMPTY_OVERRIDE = {
  seoTitle: '',
  seoDescription: '',
  allowIndexing: true,
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState([]);
  const [selectedPath, setSelectedPath] = useState('');
  const [form, setForm] = useState(EMPTY_OVERRIDE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchPages = useCallback(async (selectFirst = false) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pages', { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        setPages(data.pages || []);
        if (selectFirst && data.pages?.length) {
          setSelectedPath(data.pages[0].path);
        }
      } else {
        showSnackbar(data.error || 'Failed to load pages', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages(true);
  }, [fetchPages]);

  const selectedPage = useMemo(
    () => pages.find((page) => page.path === selectedPath) || null,
    [pages, selectedPath]
  );

  useEffect(() => {
    if (!selectedPage) return;
    const override = selectedPage.override || {};
    setForm({
      seoTitle: override.seoTitle || '',
      seoDescription: override.seoDescription || '',
      allowIndexing:
        override.allowIndexing !== undefined ? override.allowIndexing : selectedPage.defaults.allowIndexing !== false,
      canonicalUrl: override.canonicalUrl || '',
      ogTitle: override.ogTitle || '',
      ogDescription: override.ogDescription || '',
      ogImage: override.ogImage || '',
    });
  }, [selectedPage]);

  const filteredPages = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return pages;
    return pages.filter(
      (page) =>
        page.label.toLowerCase().includes(query) ||
        page.path.toLowerCase().includes(query) ||
        page.group.toLowerCase().includes(query)
    );
  }, [pages, search]);

  const groupedPages = useMemo(() => {
    const groups = {};
    for (const page of filteredPages) {
      if (!groups[page.group]) groups[page.group] = [];
      groups[page.group].push(page);
    }
    return groups;
  }, [filteredPages]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ path: selectedPage.path, override: form }),
      });
      const data = await res.json();
      if (res.ok) {
        setPages(data.pages || []);
        showSnackbar('Page SEO saved');
      } else {
        showSnackbar(data.error || 'Failed to save', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!selectedPage) return;
    if (!window.confirm(`Reset SEO overrides for "${selectedPage.label}"?`)) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ path: selectedPage.path, clear: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setPages(data.pages || []);
        showSnackbar('Overrides cleared — using default SEO');
      } else {
        showSnackbar(data.error || 'Failed to reset', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Pages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Override SEO title, meta description, canonical URL, indexing, and social sharing tags for each site page.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<IconRefresh size={16} />}
          onClick={fetchPages}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '320px 1fr' }, gap: 3, alignItems: 'start' }}>
        <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e5eaef' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconFiles size={16} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {Object.entries(groupedPages).map(([group, groupPages]) => (
              <Box key={group}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    px: 2,
                    py: 1.5,
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    bgcolor: '#F8FAFC',
                  }}
                >
                  {group}
                </Typography>
                <List disablePadding>
                  {groupPages.map((page) => (
                    <ListItemButton
                      key={page.path}
                      selected={page.path === selectedPath}
                      onClick={() => setSelectedPath(page.path)}
                      sx={{ py: 1.25, px: 2 }}
                    >
                      <ListItemText
                        primary={page.label}
                        secondary={page.path}
                        slotProps={{
                          primary: { sx: { fontWeight: 600, fontSize: '0.9rem' } },
                          secondary: { sx: { fontSize: '0.75rem' } },
                        }}
                      />
                      {page.hasOverride && (
                        <Chip label="Custom" size="small" color="primary" variant="outlined" sx={{ ml: 1, height: 22, fontSize: '0.65rem' }} />
                      )}
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        </Paper>

        <Box>
          {!selectedPage ? (
            <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">Select a page to edit its SEO settings.</Typography>
            </Paper>
          ) : (
            <>
              <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {selectedPage.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {selectedPage.path}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      component={Link}
                      href={selectedPage.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      startIcon={<IconExternalLink size={16} />}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      View Page
                    </Button>
                    {selectedPage.hasOverride && (
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<IconArrowBack size={16} />}
                        onClick={handleReset}
                        disabled={saving}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        Reset to Default
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size={16} />}
                      onClick={handleSave}
                      disabled={saving}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Default SEO (from code)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <strong>Title:</strong> {selectedPage.defaults.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Description:</strong> {selectedPage.defaults.description}
                </Typography>
              </Paper>

              <SeoFields
                hideSlug
                seoTitle={form.seoTitle}
                seoDescription={form.seoDescription}
                allowIndexing={form.allowIndexing}
                onChange={handleFieldChange}
                indexingLabel="Allow Search Engine Indexing"
                indexingHelper="Leave blank fields to use the page defaults. Uncheck to add a noindex tag for this page."
              />

              <SocialFields
                ogTitle={form.ogTitle}
                ogDescription={form.ogDescription}
                ogImage={form.ogImage}
                canonicalUrl={form.canonicalUrl}
                onChange={handleFieldChange}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size={16} />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Save Changes
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
