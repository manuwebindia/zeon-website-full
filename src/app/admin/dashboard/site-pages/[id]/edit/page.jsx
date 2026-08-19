'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box, Typography, Paper, Button, TextField, Switch, FormControlLabel,
  Snackbar, Alert, CircularProgress, MenuItem, Divider,
} from '@mui/material';
import { IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';
import TextBlock from '@/components/admin/TextBlock';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('zeon_admin_token') : '';
}
function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}
function can(key) {
  try {
    const perms = JSON.parse(localStorage.getItem('zeon_admin_permissions') || '[]');
    return perms.includes('*') || perms.includes(key);
  } catch {
    return false;
  }
}

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  seoTitle: '',
  seoDescription: '',
  featuredImage: '',
  allowIndexing: true,
  status: 'draft',
  content: [{ id: '1', type: 'text', html: '' }],
};

export default function AdminSitePageEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const pageId = isNew ? null : params.id;

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  useEffect(() => {
    const ok = isNew ? can('pages.create') : can('pages.edit');
    if (!ok) router.replace('/admin/dashboard/site-pages');
  }, [router, isNew]);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/site-pages/${pageId}`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        const p = data.page;
        setForm({
          title: p.title || '',
          slug: p.slug || '',
          excerpt: p.excerpt || '',
          seoTitle: p.seoTitle || '',
          seoDescription: p.seoDescription || '',
          featuredImage: p.featuredImage || '',
          allowIndexing: p.allowIndexing !== false,
          status: p.status || 'draft',
          content: Array.isArray(p.content) ? p.content : EMPTY.content,
        });
      } catch (err) {
        showSnackbar(err.message, 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [isNew, pageId]);

  const updateBlock = (index, html) => {
    setForm((prev) => {
      const content = [...prev.content];
      content[index] = { ...content[index], html };
      return { ...prev, content };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = isNew ? '/api/admin/site-pages' : `/api/admin/site-pages/${pageId}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      showSnackbar('Saved');
      if (isNew) router.replace(`/admin/dashboard/site-pages/${data.id}/edit`);
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button component={Link} href="/admin/dashboard/site-pages" startIcon={<IconArrowLeft size={16} />} sx={{ textTransform: 'none' }}>
          Back
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
          {isNew ? 'New Site Page' : 'Edit Site Page'}
        </Typography>
        <Button variant="contained" startIcon={<IconDeviceFloppy size={16} />} onClick={handleSave} disabled={saving} sx={{ textTransform: 'none' }}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 2, mb: 2 }}>
        <TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} sx={{ mb: 2 }} />
        <TextField fullWidth label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} helperText={`Public URL: /${form.slug || '…'}`} sx={{ mb: 2 }} />
        <TextField fullWidth multiline minRows={2} label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} sx={{ mb: 2 }} />
        <TextField fullWidth label="Featured image URL" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} sx={{ mb: 2 }} />
        <TextField select fullWidth label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} sx={{ mb: 2 }}>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="published">Published</MenuItem>
        </TextField>
        <FormControlLabel
          control={<Switch checked={form.allowIndexing} onChange={(e) => setForm({ ...form, allowIndexing: e.target.checked })} />}
          label="Allow search indexing"
        />
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>SEO</Typography>
        <TextField fullWidth label="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} sx={{ mb: 2 }} />
        <TextField fullWidth multiline minRows={2} label="SEO description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Content</Typography>
        {form.content.map((block, idx) => {
          if (block.type === 'text') {
            return (
              <Box key={block.id || idx} sx={{ mb: 3 }}>
                <TextBlock content={block.html || ''} onChange={(html) => updateBlock(idx, html)} />
              </Box>
            );
          }
          if (block.type === 'image') {
            return (
              <Box key={block.id || idx} sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">Image block</Typography>
                <Typography variant="body2">{block.src}</Typography>
              </Box>
            );
          }
          return null;
        })}
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
