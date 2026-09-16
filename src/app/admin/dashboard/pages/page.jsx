'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import Link from 'next/link';
import {
  IconFiles,
  IconExternalLink,
  IconDeviceFloppy,
  IconRefresh,
  IconArrowBack,
  IconPhoto,
  IconCloudUpload,
  IconFolder,
  IconTrash,
  IconPlus,
  IconCopy,
  IconSeo,
} from '@tabler/icons-react';
import SeoFields from '@/components/admin/SeoFields';
import SocialFields from '@/components/admin/SocialFields';
import MediaPickerDialog from '@/components/admin/MediaPickerDialog';
import TextBlock from '@/components/admin/TextBlock';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('zeon_admin_token') : '';
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

const EMPTY_FORM = {
  // CMS Fields
  bannerImage: '',
  bannerTitle: '',
  bannerSubtitle: '',
  title: '',
  excerpt: '',
  status: 'published',
  content: [{ id: '1', type: 'text', html: '' }],
  // SEO
  seoTitle: '',
  seoDescription: '',
  allowIndexing: true,
  // Social
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState([]);
  const [selectedPath, setSelectedPath] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', slug: '', excerpt: '', bannerImage: '', status: 'draft' });
  const [creating, setCreating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fileInputRef = useRef(null);

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pages', { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        setPages(data.pages || []);
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
    fetchPages();
  }, [fetchPages]);

  const selectedPage = useMemo(
    () => pages.find((page) => page.path === selectedPath) || null,
    [pages, selectedPath]
  );

  useEffect(() => {
    if (!selectedPage) return;
    const override = selectedPage.override || {};

    let initialContent = [{ id: '1', type: 'text', html: '' }];
    if (Array.isArray(selectedPage.content)) {
      initialContent = selectedPage.content;
    } else if (typeof selectedPage.content === 'string' && selectedPage.content) {
      initialContent = [{ id: '1', type: 'text', html: selectedPage.content }];
    } else if (typeof override.content === 'string' && override.content) {
      initialContent = [{ id: '1', type: 'text', html: override.content }];
    } else if (Array.isArray(override.content)) {
      initialContent = override.content;
    }

    if (selectedPage.source === 'static') {
      setForm({
        bannerImage: override.bannerImage || selectedPage.bannerImage || '',
        bannerTitle: override.bannerTitle || '',
        bannerSubtitle: override.bannerSubtitle || '',
        title: selectedPage.label,
        excerpt: override.bannerSubtitle || '',
        status: 'published',
        content: initialContent,
        seoTitle: override.seoTitle || '',
        seoDescription: override.seoDescription || '',
        allowIndexing:
          override.allowIndexing !== undefined
            ? override.allowIndexing
            : selectedPage.defaults.allowIndexing !== false,
        canonicalUrl: override.canonicalUrl || '',
        ogTitle: override.ogTitle || '',
        ogDescription: override.ogDescription || '',
        ogImage: override.ogImage || '',
      });
      return;
    }

    // CMS Site Page
    setForm({
      bannerImage: selectedPage.bannerImage || override.bannerImage || '',
      bannerTitle: selectedPage.title || selectedPage.label || '',
      bannerSubtitle: selectedPage.excerpt || '',
      title: selectedPage.title || selectedPage.label || '',
      excerpt: selectedPage.excerpt || '',
      status: selectedPage.status || 'published',
      content: initialContent,
      seoTitle: override.seoTitle || selectedPage.effective?.title || '',
      seoDescription: override.seoDescription || selectedPage.effective?.description || '',
      allowIndexing: selectedPage.effective?.allowIndexing !== false,
      canonicalUrl: selectedPage.path,
      ogTitle: override.ogTitle || '',
      ogDescription: override.ogDescription || '',
      ogImage: override.ogImage || selectedPage.bannerImage || '',
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

  const handleBlockChange = (index, html) => {
    setForm((prev) => {
      const updated = [...prev.content];
      updated[index] = { ...updated[index], html };
      return { ...prev, content: updated };
    });
  };

  const handleAddBlock = () => {
    setForm((prev) => ({
      ...prev,
      content: [...prev.content, { id: String(Date.now()), type: 'text', html: '' }],
    }));
  };

  const handleDeleteBlock = (index) => {
    setForm((prev) => {
      if (prev.content.length <= 1) {
        return { ...prev, content: [{ id: '1', type: 'text', html: '' }] };
      }
      return { ...prev, content: prev.content.filter((_, i) => i !== index) };
    });
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showSnackbar('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar('File size must be under 5MB', 'error');
      return;
    }

    setUploadingBanner(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      handleFieldChange('bannerImage', data.url);
      showSnackbar('Banner uploaded');
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setUploadingBanner(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      const payload = {
        path: selectedPage.path,
        override: {
          ...form,
          content: selectedPage.source === 'static' ? (form.content[0]?.html || '') : form.content,
        },
      };

      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setPages(data.pages || []);
        showSnackbar('Page content & banner saved successfully!');
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
    if (!window.confirm(`Reset CMS and SEO overrides for "${selectedPage.label}"?`)) return;
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
        showSnackbar('Overrides cleared — using default settings');
      } else {
        showSnackbar(data.error || 'Failed to reset', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePage = async () => {
    if (!createForm.title.trim()) {
      showSnackbar('Title is required', 'error');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          action: 'create',
          title: createForm.title.trim(),
          slug: createForm.slug.trim(),
          excerpt: createForm.excerpt.trim(),
          bannerImage: createForm.bannerImage.trim(),
          status: createForm.status,
          content: [{ id: '1', type: 'text', html: '' }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create page');

      showSnackbar('New page created successfully!');
      setPages(data.pages || []);
      setCreateDialogOpen(false);
      setCreateForm({ title: '', slug: '', excerpt: '', bannerImage: '', status: 'draft' });
      if (data.page?.path) {
        setSelectedPath(data.page.path);
      }
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const showList = !selectedPath;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1150, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Pages (CMS)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage banner images, content, and SEO metadata for all site pages.
          </Typography>
        </Box>
        {showList && (
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<IconPlus size={16} />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Create Page
            </Button>
            <Button
              variant="outlined"
              startIcon={<IconRefresh size={16} />}
              onClick={fetchPages}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>
        )}
      </Box>

      {showList ? (
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

          <Box>
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
                      onClick={() => setSelectedPath(page.path)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderBottom: '1px solid #f1f5f9',
                        '&:hover': { bgcolor: '#FFF5F5' },
                      }}
                    >
                      <ListItemText
                        primary={page.label}
                        secondary={page.path}
                        slotProps={{
                          primary: { sx: { fontWeight: 600, fontSize: '0.95rem' } },
                          secondary: { sx: { fontSize: '0.8rem' } },
                        }}
                      />
                      {page.status === 'draft' && (
                        <Chip
                          label="Draft"
                          size="small"
                          color="warning"
                          variant="outlined"
                          sx={{ ml: 1, height: 24, fontSize: '0.7rem' }}
                        />
                      )}
                      {page.hasOverride && (
                        <Chip
                          label="Custom CMS"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ ml: 1, height: 24, fontSize: '0.7rem' }}
                        />
                      )}
                      {page.source && page.source !== 'static' && (
                        <Chip
                          label={page.group}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1, height: 24, fontSize: '0.7rem' }}
                        />
                      )}
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            ))}
            {!filteredPages.length && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No pages match your search.</Typography>
              </Box>
            )}
          </Box>
        </Paper>
      ) : selectedPage ? (
        <>
          {/* Top Bar for Selected Page */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, gap: 2, flexWrap: 'wrap' }}>
            <Button
              startIcon={<IconArrowBack size={16} />}
              onClick={() => setSelectedPath('')}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Back to Pages
            </Button>
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
              {selectedPage.hasOverride && !selectedPage.readOnly && (
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleReset}
                  disabled={saving}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Reset to Default
                </Button>
              )}
              {!selectedPage.readOnly && (
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size={16} />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
                >
                  Save Changes
                </Button>
              )}
            </Box>
          </Box>

          {/* Page Info Header Card */}
          <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {selectedPage.label}
                  </Typography>
                  <Chip
                    label={selectedPage.source === 'static' ? 'Built-in Page' : selectedPage.source === 'site-page' ? 'CMS Page' : selectedPage.group}
                    size="small"
                    color="default"
                    sx={{ fontWeight: 600 }}
                  />
                  {selectedPage.status && (
                    <Chip
                      label={selectedPage.status === 'published' ? 'Published' : 'Draft'}
                      size="small"
                      color={selectedPage.status === 'published' ? 'success' : 'warning'}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Public URL: <strong>{selectedPage.path}</strong>
                </Typography>
              </Box>
            </Box>

            {selectedPage.readOnly && (
              <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                This page content is managed under Admin → Offers.
              </Alert>
            )}
          </Paper>

          {!selectedPage.readOnly && (
            <>
              {/* Navigation Tabs */}
              <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, mb: 3, overflow: 'hidden' }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, val) => setActiveTab(val)}
                  sx={{
                    borderBottom: '1px solid #e5eaef',
                    px: 2,
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', minHeight: 48 },
                  }}
                >
                  <Tab icon={<IconPhoto size={18} />} iconPosition="start" label="Banner & Content (CMS)" />
                  <Tab icon={<IconSeo size={18} />} iconPosition="start" label="SEO & Social Meta" />
                </Tabs>

                {/* TAB 0: CMS BANNER & CONTENT */}
                {activeTab === 0 && (
                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    {/* SECTION 1: HERO BANNER IMAGE */}
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Hero Banner Image
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Displays at the top of the page. Upload an image, choose from Media Library, or enter an image URL.
                          </Typography>
                        </Box>
                        {form.bannerImage && (
                          <Tooltip title="Copy Banner Image to Social / Open Graph Image">
                            <Button
                              size="small"
                              variant="text"
                              startIcon={<IconCopy size={15} />}
                              onClick={() => {
                                handleFieldChange('ogImage', form.bannerImage);
                                showSnackbar('Copied Banner URL to Social Image!');
                              }}
                              sx={{ textTransform: 'none', fontSize: '0.78rem' }}
                            >
                              Sync with OG Image
                            </Button>
                          </Tooltip>
                        )}
                      </Box>

                      {/* Banner Image Preview Container */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          minHeight: 200,
                          maxHeight: 280,
                          borderRadius: 2.5,
                          overflow: 'hidden',
                          border: '2px dashed #cbd5e1',
                          bgcolor: '#F8FAFC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        {form.bannerImage ? (
                          <>
                            <Box
                              component="img"
                              src={form.bannerImage}
                              alt="Page Hero Banner"
                              sx={{
                                width: '100%',
                                height: 280,
                                objectFit: 'cover',
                                objectPosition: 'center',
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: 'rgba(0,0,0,0.3)',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1.5,
                                '&:hover': { opacity: 1 },
                              }}
                            >
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<IconFolder size={16} />}
                                onClick={() => setMediaPickerOpen(true)}
                                sx={{ textTransform: 'none', bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#f1f5f9' } }}
                              >
                                Change
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                startIcon={<IconTrash size={16} />}
                                onClick={() => handleFieldChange('bannerImage', '')}
                                sx={{ textTransform: 'none' }}
                              >
                                Remove
                              </Button>
                            </Box>
                          </>
                        ) : (
                          <Box sx={{ textAlign: 'center', p: 3 }}>
                            <IconPhoto size={48} color="#94a3b8" />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              No custom banner image set. Using default header background.
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Controls: Upload / Media Picker / URL */}
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleBannerUpload}
                        />
                        <Button
                          variant="outlined"
                          startIcon={uploadingBanner ? <CircularProgress size={16} /> : <IconCloudUpload size={16} />}
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingBanner}
                          sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                          {uploadingBanner ? 'Uploading…' : 'Upload Banner'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<IconFolder size={16} />}
                          onClick={() => setMediaPickerOpen(true)}
                          sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                          Choose from Media Library
                        </Button>
                        {form.bannerImage && (
                          <Button
                            variant="text"
                            color="error"
                            startIcon={<IconTrash size={16} />}
                            onClick={() => handleFieldChange('bannerImage', '')}
                            sx={{ textTransform: 'none' }}
                          >
                            Remove
                          </Button>
                        )}
                      </Box>

                      <TextField
                        fullWidth
                        size="small"
                        label="Banner Image URL"
                        placeholder="e.g. /banner-white.svg or image URL"
                        value={form.bannerImage}
                        onChange={(e) => handleFieldChange('bannerImage', e.target.value)}
                        helperText="Direct image URL path or upload from above"
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* SECTION 2: HERO BANNER HEADINGS / INFO */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        Hero Banner Text
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        Custom heading and subheading displayed on the hero banner.
                      </Typography>

                      <TextField
                        fullWidth
                        label={selectedPage.source === 'site-page' ? 'Page Title' : 'Banner Headline Override'}
                        value={selectedPage.source === 'site-page' ? form.title : form.bannerTitle}
                        onChange={(e) => {
                          if (selectedPage.source === 'site-page') {
                            handleFieldChange('title', e.target.value);
                          } else {
                            handleFieldChange('bannerTitle', e.target.value);
                          }
                        }}
                        placeholder={selectedPage.label}
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label={selectedPage.source === 'site-page' ? 'Page Excerpt / Subtitle' : 'Banner Subtitle / Tagline Override'}
                        value={selectedPage.source === 'site-page' ? form.excerpt : form.bannerSubtitle}
                        onChange={(e) => {
                          if (selectedPage.source === 'site-page') {
                            handleFieldChange('excerpt', e.target.value);
                          } else {
                            handleFieldChange('bannerSubtitle', e.target.value);
                          }
                        }}
                        placeholder={selectedPage.source === 'static' ? 'Custom subtitle or tagline for hero banner...' : 'Brief summary of the page...'}
                        sx={{ mb: 2 }}
                      />

                      {selectedPage.source === 'site-page' && (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Publishing Status"
                          value={form.status}
                          onChange={(e) => handleFieldChange('status', e.target.value)}
                          sx={{ mb: 2 }}
                        >
                          <MenuItem value="published">Published (Live)</MenuItem>
                          <MenuItem value="draft">Draft (Admin Only)</MenuItem>
                        </TextField>
                      )}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* SECTION 3: BODY CONTENT */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Page Content
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedPage.source === 'site-page'
                              ? 'Write and format the body content for this page.'
                              : 'Optional body content or notes to display on this page.'}
                          </Typography>
                        </Box>
                        {selectedPage.source === 'site-page' && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<IconPlus size={15} />}
                            onClick={handleAddBlock}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            Add Block
                          </Button>
                        )}
                      </Box>

                      {/* Render Content Blocks */}
                      {form.content.map((block, index) => (
                        <Box
                          key={block.id || index}
                          sx={{
                            border: '1px solid #e2e8f0',
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            bgcolor: '#fff',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                              Content Block {index + 1}
                            </Typography>
                            {selectedPage.source === 'site-page' && form.content.length > 1 && (
                              <IconButton size="small" color="error" onClick={() => handleDeleteBlock(index)}>
                                <IconTrash size={16} />
                              </IconButton>
                            )}
                          </Box>
                          <TextBlock
                            content={block.html || ''}
                            onChange={(html) => handleBlockChange(index, html)}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* TAB 1: SEO & SOCIAL META */}
                {activeTab === 1 && (
                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      Search Engine Optimization (SEO)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                      Configure how search engines index and display this page in search results.
                    </Typography>

                    <SeoFields
                      hideSlug
                      seoTitle={form.seoTitle}
                      seoDescription={form.seoDescription}
                      allowIndexing={form.allowIndexing}
                      onChange={handleFieldChange}
                      indexingLabel="Allow Search Engine Indexing"
                      indexingHelper={
                        selectedPage.source === 'static'
                          ? 'Leave blank fields to use the page defaults. Uncheck to add a noindex tag for this page.'
                          : 'Leave blank to use the page title and excerpt as defaults.'
                      }
                    />

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      Social Media Sharing (Open Graph)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                      Customize preview title, description, and preview image when sharing this page on WhatsApp, Facebook, LinkedIn, etc.
                    </Typography>

                    <SocialFields
                      ogTitle={form.ogTitle}
                      ogDescription={form.ogDescription}
                      ogImage={form.ogImage}
                      canonicalUrl={form.canonicalUrl}
                      onChange={handleFieldChange}
                    />
                  </Box>
                )}
              </Paper>

              {/* Bottom Sticky-style Action Bar */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedPath('')}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size={16} />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ textTransform: 'none', borderRadius: 2, px: 4 }}
                >
                  Save Changes
                </Button>
              </Box>
            </>
          )}
        </>
      ) : null}

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          handleFieldChange('bannerImage', url);
          setMediaPickerOpen(false);
          showSnackbar('Banner image selected!');
        }}
        title="Select Banner Image"
      />

      {/* Create New Page Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => !creating && setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create New CMS Page</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Create a custom landing or policy page that you can design and edit with the CMS.
          </Typography>

          <TextField
            fullWidth
            label="Page Title"
            placeholder="e.g. Terms of Service, Refund Policy"
            value={createForm.title}
            onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="URL Slug (Optional)"
            placeholder="e.g. refund-policy (auto-generated if empty)"
            value={createForm.slug}
            onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })}
            helperText={`Will be accessible at /${createForm.slug || '...'}`}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Excerpt / Subtitle"
            value={createForm.excerpt}
            onChange={(e) => setCreateForm({ ...createForm, excerpt: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Hero Banner Image URL (Optional)"
            value={createForm.bannerImage}
            onChange={(e) => setCreateForm({ ...createForm, bannerImage: e.target.value })}
            placeholder="e.g. /banner-white.svg or image link"
            sx={{ mb: 2 }}
          />

          <TextField
            select
            fullWidth
            size="small"
            label="Initial Status"
            value={createForm.status}
            onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
          >
            <MenuItem value="draft">Draft (Admin Only)</MenuItem>
            <MenuItem value="published">Published (Live)</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            disabled={creating}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreatePage}
            disabled={creating}
            startIcon={creating ? <CircularProgress size={16} color="inherit" /> : <IconPlus size={16} />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {creating ? 'Creating…' : 'Create Page'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
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
