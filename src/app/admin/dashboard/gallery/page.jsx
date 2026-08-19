'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box, Typography, Paper, Button, Chip, IconButton, CircularProgress, Snackbar, Alert,
} from '@mui/material';
import { IconPlus, IconPencil, IconTrash, IconRefresh, IconPhoto } from '@tabler/icons-react';

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

export default function AdminGalleryListPage() {
  const router = useRouter();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery', { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setAlbums(data.albums || []);
      else showSnackbar(data.error || 'Failed to load albums', 'error');
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!can('gallery.view')) router.replace('/admin/dashboard');
  }, [router]);

  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  const handleDelete = async (id, title) => {
    if (!can('gallery.delete')) return;
    if (!window.confirm(`Delete album "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showSnackbar('Album deleted');
        fetchAlbums();
      } else {
        const data = await res.json();
        showSnackbar(data.error || 'Delete failed', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
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
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Gallery</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage photo albums shown on /gallery and album inner pages.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<IconRefresh size={16} />} onClick={fetchAlbums} sx={{ textTransform: 'none', borderRadius: 2 }}>
            Refresh
          </Button>
          {can('gallery.create') && (
            <Button
              variant="contained"
              component={Link}
              href="/admin/dashboard/gallery/new/edit"
              startIcon={<IconPlus size={16} />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Add Album
            </Button>
          )}
        </Box>
      </Box>

      {!albums.length ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '2px dashed #e5eaef', borderRadius: 2 }}>
          <IconPhoto size={36} stroke={1.2} style={{ opacity: 0.35, marginBottom: 8 }} />
          <Typography color="text.secondary">No albums yet. Create your first gallery album.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {albums.map((album) => (
            <Paper key={album.id} elevation={0} sx={{ p: 2, border: '1px solid #e5eaef', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {album.coverImage ? (
                <Box component="img" src={album.coverImage} alt="" sx={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 1, border: '1px solid #e5eaef' }} />
              ) : (
                <Box sx={{ width: 72, height: 54, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e5eaef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconPhoto size={20} stroke={1.2} style={{ opacity: 0.4 }} />
                </Box>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700 }}>{album.title}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>/gallery/{album.slug}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip label={`${album._count?.images ?? 0} photos`} size="small" />
                  <Chip label={album.status} size="small" color={album.status === 'published' ? 'success' : 'default'} />
                </Box>
              </Box>
              {can('gallery.edit') && (
                <IconButton component={Link} href={`/admin/dashboard/gallery/${album.id}/edit`}>
                  <IconPencil size={16} />
                </IconButton>
              )}
              {can('gallery.delete') && (
                <IconButton color="error" onClick={() => handleDelete(album.id, album.title)}>
                  <IconTrash size={16} />
                </IconButton>
              )}
            </Paper>
          ))}
        </Box>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
