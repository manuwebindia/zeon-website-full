'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box, Typography, Paper, Button, TextField, Switch, FormControlLabel,
  Snackbar, Alert, CircularProgress, Divider, IconButton, MenuItem, Grid,
} from '@mui/material';
import { IconDeviceFloppy, IconArrowLeft, IconCloudUpload, IconPhoto, IconTrash } from '@tabler/icons-react';
import MediaPickerDialog from '@/components/admin/MediaPickerDialog';

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
  description: '',
  coverImage: '',
  seoTitle: '',
  seoDescription: '',
  allowIndexing: true,
  status: 'draft',
  sortOrder: 0,
  eventDate: '',
  images: [],
};

export default function AdminGalleryEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const albumId = isNew ? null : params.id;

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('cover');
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  useEffect(() => {
    const ok = isNew ? can('gallery.create') : can('gallery.edit');
    if (!ok) router.replace('/admin/dashboard/gallery');
  }, [router, isNew]);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/gallery/${albumId}`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          coverImage: data.coverImage || '',
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          allowIndexing: data.allowIndexing !== false,
          status: data.status || 'draft',
          sortOrder: data.sortOrder ?? 0,
          eventDate: data.eventDate ? data.eventDate.slice(0, 10) : '',
          images: (data.images || []).map((img) => ({
            src: img.src,
            alt: img.alt || '',
            caption: img.caption || '',
            sortOrder: img.sortOrder ?? 0,
          })),
        });
      } catch (err) {
        showSnackbar(err.message, 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [albumId, isNew]);

  const uploadFile = async (file, folder = 'gallery') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      if (mediaTarget === 'cover') {
        const url = await uploadFile(files[0]);
        setForm((p) => ({ ...p, coverImage: url }));
      } else {
        const urls = await Promise.all(files.map((f) => uploadFile(f)));
        setForm((p) => ({
          ...p,
          images: [
            ...p.images,
            ...urls.map((src, idx) => ({
              src,
              alt: '',
              caption: '',
              sortOrder: p.images.length + idx,
            })),
          ],
        }));
      }
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showSnackbar('Title is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder) || 0 };
      const url = isNew ? '/api/admin/gallery' : `/api/admin/gallery/${albumId}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      showSnackbar('Album saved');
      if (isNew) router.replace(`/admin/dashboard/gallery/${data.id}/edit`);
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeImage = (idx) => {
    setForm((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== idx).map((img, i) => ({ ...img, sortOrder: i })),
    }));
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
      <Button
        component={Link}
        href="/admin/dashboard/gallery"
        startIcon={<IconArrowLeft size={16} />}
        sx={{ textTransform: 'none', mb: 2 }}
      >
        Back to Gallery
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        {isNew ? 'Add Album' : 'Edit Album'}
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 3, mb: 2 }}>
        <Grid container spacing={2.5}>
          <Grid size={12}>
            <TextField fullWidth required label="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} helperText="Public URL: /gallery/your-slug" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth type="date" label="Event Date" value={form.eventDate} onChange={(e) => setForm((p) => ({ ...p, eventDate: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth type="number" label="Sort Order" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth select label="Status" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControlLabel control={<Switch checked={form.allowIndexing} onChange={(e) => setForm((p) => ({ ...p, allowIndexing: e.target.checked }))} />} label="Allow indexing" />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 3, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Cover Image</Typography>
        {form.coverImage && (
          <Box component="img" src={form.coverImage} alt="" sx={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 1, border: '1px solid #e5eaef', mb: 2 }} />
        )}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button size="small" variant="outlined" startIcon={uploading ? <CircularProgress size={14} /> : <IconCloudUpload size={16} />} onClick={() => { setMediaTarget('cover'); fileInputRef.current?.click(); }} disabled={uploading}>
            Upload Cover
          </Button>
          <Button size="small" variant="outlined" startIcon={<IconPhoto size={16} />} onClick={() => { setMediaTarget('cover'); setMediaPickerOpen(true); }}>
            Media Library
          </Button>
          {form.coverImage && (
            <Button size="small" color="error" onClick={() => setForm((p) => ({ ...p, coverImage: '' }))}>Remove</Button>
          )}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 3, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Photos ({form.images.length})</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={uploading ? <CircularProgress size={14} /> : <IconCloudUpload size={16} />} onClick={() => { setMediaTarget('photos'); fileInputRef.current?.click(); fileInputRef.current.multiple = true; }} disabled={uploading}>
            Upload Photos
          </Button>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 1.5 }}>
          {form.images.map((img, idx) => (
            <Box key={`${img.src}-${idx}`} sx={{ position: 'relative', border: '1px solid #e5eaef', borderRadius: 1, overflow: 'hidden' }}>
              <Box component="img" src={img.src} alt="" sx={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
              <IconButton size="small" color="error" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'white' }} onClick={() => removeImage(idx)}>
                <IconTrash size={14} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>SEO</Typography>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField fullWidth label="SEO Title" value={form.seoTitle} onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth multiline rows={2} label="SEO Description" value={form.seoDescription} onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))} />
          </Grid>
        </Grid>
      </Paper>

      <Button
        variant="contained"
        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size={16} />}
        onClick={handleSave}
        disabled={saving}
        sx={{ textTransform: 'none', borderRadius: 2 }}
      >
        Save Album
      </Button>

      <input type="file" ref={fileInputRef} hidden accept="image/*" multiple={mediaTarget === 'photos'} onChange={handleFileChange} />

      <MediaPickerDialog
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedUrl={mediaTarget === 'cover' ? form.coverImage : ''}
        title="Choose Image"
        onSelect={(url) => {
          if (mediaTarget === 'cover') {
            setForm((p) => ({ ...p, coverImage: url }));
          } else {
            setForm((p) => ({
              ...p,
              images: [...p.images, { src: url, alt: '', caption: '', sortOrder: p.images.length }],
            }));
          }
        }}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
