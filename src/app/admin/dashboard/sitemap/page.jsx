'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Switch, Select, MenuItem,
  FormControl, InputLabel, Slider, Snackbar, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Tooltip, Chip, Divider, Grid,
} from '@mui/material';
import {
  IconMap, IconPlus, IconTrash, IconExternalLink, IconRefresh,
  IconCheck,
} from '@tabler/icons-react';

const FREQ_OPTIONS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

const PRIORITY_MARKS = [
  { value: 0, label: '0.0' },
  { value: 0.5, label: '0.5' },
  { value: 1, label: '1.0' },
];

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('wdk_admin_token') : '';
}
function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

export default function SitemapPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPath, setNewPath] = useState('');
  const [newFreq, setNewFreq] = useState('monthly');
  const [newPriority, setNewPriority] = useState(0.5);
  const [newCanonical, setNewCanonical] = useState('');
  const [addError, setAddError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sitemap', { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setConfig(data);
      else showSnackbar(data.error || 'Failed to load sitemap config', 'error');
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/sitemap', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) { showSnackbar(data.error || 'Failed to save', 'error'); return; }
      setConfig(data);
      showSnackbar('Sitemap configuration saved');
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updatePage = (index, field, value) => {
    setConfig((prev) => {
      const pages = [...prev.staticPages];
      pages[index] = { ...pages[index], [field]: value };
      return { ...prev, staticPages: pages };
    });
  };

  const removePage = (index) => {
    setConfig((prev) => ({
      ...prev,
      staticPages: prev.staticPages.filter((_, i) => i !== index),
    }));
  };

  const handleAddPage = () => {
    if (!newPath.trim() || !newPath.startsWith('/')) {
      setAddError('Path must start with /');
      return;
    }
    if (config.staticPages.some((p) => p.path === newPath.trim())) {
      setAddError('This path already exists');
      return;
    }
    setConfig((prev) => ({
      ...prev,
      staticPages: [
        ...prev.staticPages,
        { path: newPath.trim(), changeFrequency: newFreq, priority: newPriority, enabled: true, canonical: newCanonical.trim() },
      ],
    }));
    setAddDialogOpen(false);
    setNewPath('');
    setNewFreq('monthly');
    setNewPriority(0.5);
    setNewCanonical('');
    setAddError('');
  };

  const enabledCount = config?.staticPages?.filter((p) => p.enabled !== false).length || 0;
  const totalPages = config?.staticPages?.length || 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!config) return null;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Sitemap & SEO Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Control which pages appear in your sitemap.xml, their crawl frequency, and priority signals for search engines.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<IconExternalLink size={16} />}
            href="/sitemap.xml"
            target="_blank"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            View Live Sitemap
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconCheck size={16} />}
            onClick={handleSave}
            disabled={saving}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {/* Stats bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Static Pages', value: totalPages, color: '#1A4FD6' },
          { label: 'Enabled in Sitemap', value: enabledCount, color: '#17C653' },
          { label: 'Excluded', value: totalPages - enabledCount, color: '#EF4444' },
        ].map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e5eaef', textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Static Pages Table */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={1} sx={{ borderRadius: 3, border: '1px solid #e5eaef', overflow: 'hidden' }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5eaef' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconMap size={20} style={{ color: '#1A4FD6' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Static Pages</Typography>
              </Box>
              <Button
                size="small"
                startIcon={<IconPlus size={16} />}
                onClick={() => setAddDialogOpen(true)}
                variant="outlined"
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
              >
                Add URL
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 700, width: 40 }}>On</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Page Path</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>Canonical URL Override</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 130 }}>Frequency</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Priority</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {config.staticPages.map((page, idx) => (
                    <TableRow key={page.path} sx={{ '&:last-child td': { border: 0 }, opacity: page.enabled === false ? 0.45 : 1 }}>
                      <TableCell>
                        <Switch
                          size="small"
                          checked={page.enabled !== false}
                          onChange={(e) => updatePage(idx, 'enabled', e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                          {page.path}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          placeholder="Default URL"
                          value={page.canonical || ''}
                          onChange={(e) => updatePage(idx, 'canonical', e.target.value)}
                          inputProps={{ style: { fontSize: '0.82rem', fontFamily: 'monospace' } }}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={page.changeFrequency}
                            onChange={(e) => updatePage(idx, 'changeFrequency', e.target.value)}
                            sx={{ fontSize: '0.82rem' }}
                          >
                            {FREQ_OPTIONS.map((f) => (
                              <MenuItem key={f} value={f}>{f}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ px: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Slider
                            size="small"
                            min={0}
                            max={1}
                            step={0.1}
                            value={Number(page.priority)}
                            onChange={(_, v) => updatePage(idx, 'priority', v)}
                            sx={{ flex: 1, color: '#1A4FD6' }}
                          />
                          <Chip
                            label={Number(page.priority).toFixed(1)}
                            size="small"
                            sx={{ fontSize: '0.73rem', minWidth: 40, backgroundColor: '#EFF6FF', color: '#1A4FD6', fontWeight: 700 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Remove page">
                          <IconButton size="small" color="error" onClick={() => removePage(idx)}>
                            <IconTrash size={15} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Blog Defaults + Info */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Global SEO Settings */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaef', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Global SEO Settings</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure base settings for canonical tags and crawls.
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Canonical Base URL"
              value={config.globalSettings?.canonicalBaseUrl || ''}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  globalSettings: { ...prev.globalSettings, canonicalBaseUrl: e.target.value },
                }))
              }
              placeholder="https://webdesignerskerala.in"
              helperText="Used to generate default canonical tags."
              slotProps={{
                helperText: { sx: { fontSize: '0.73rem' } }
              }}
            />
          </Paper>

          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaef', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Blog Post Defaults</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Applied to all published blog posts in the sitemap.
            </Typography>

            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel>Change Frequency</InputLabel>
              <Select
                value={config.blogDefaults?.changeFrequency || 'weekly'}
                label="Change Frequency"
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, blogDefaults: { ...prev.blogDefaults, changeFrequency: e.target.value } }))
                }
              >
                {FREQ_OPTIONS.map((f) => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Priority</Typography>
                <Chip
                  label={Number(config.blogDefaults?.priority || 0.6).toFixed(1)}
                  size="small"
                  sx={{ fontSize: '0.73rem', backgroundColor: '#EFF6FF', color: '#1A4FD6', fontWeight: 700 }}
                />
              </Box>
              <Slider
                min={0}
                max={1}
                step={0.1}
                marks={PRIORITY_MARKS}
                value={Number(config.blogDefaults?.priority || 0.6)}
                onChange={(_, v) =>
                  setConfig((prev) => ({ ...prev, blogDefaults: { ...prev.blogDefaults, priority: v } }))
                }
                sx={{ color: '#1A4FD6' }}
              />
              <Typography variant="caption" color="text.secondary">
                Recommended: 0.6–0.8 for blog posts
              </Typography>
            </Box>
          </Paper>

          {/* Info card */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaef', backgroundColor: '#F8FAFC' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Priority Guide</Typography>
            {[
              { range: '1.0', desc: 'Homepage — most important' },
              { range: '0.8–0.9', desc: 'Main sections (Blog, Services)' },
              { range: '0.6–0.7', desc: 'Secondary pages (About, Contact)' },
              { range: '0.4–0.5', desc: 'Individual blog posts' },
              { range: '< 0.4', desc: 'Low-importance pages' },
            ].map((item) => (
              <Box key={item.range} sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                <Chip label={item.range} size="small" sx={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1A4FD6', minWidth: 50 }} />
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.8 }}>{item.desc}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Add URL Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Custom URL</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1, minWidth: 340 }}>
            <TextField
              fullWidth label="Page Path" value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="/pricing, /portfolio, /team"
              error={!!addError}
              helperText={addError || 'Must start with /'}
            />
            <TextField
              fullWidth label="Canonical URL Override" value={newCanonical}
              onChange={(e) => setNewCanonical(e.target.value)}
              placeholder="e.g. https://custom.com/path (optional)"
              helperText="Leave empty to use the default page URL"
              slotProps={{
                helperText: { sx: { fontSize: '0.73rem' } }
              }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Change Frequency</InputLabel>
              <Select value={newFreq} label="Change Frequency" onChange={(e) => setNewFreq(e.target.value)}>
                {FREQ_OPTIONS.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
              </Select>
            </FormControl>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Priority</Typography>
                <Chip label={newPriority.toFixed(1)} size="small" sx={{ fontSize: '0.73rem', backgroundColor: '#EFF6FF', color: '#1A4FD6', fontWeight: 700 }} />
              </Box>
              <Slider min={0} max={1} step={0.1} marks={PRIORITY_MARKS} value={newPriority} onChange={(_, v) => setNewPriority(v)} sx={{ color: '#1A4FD6' }} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setAddDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPage} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            Add Page
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
