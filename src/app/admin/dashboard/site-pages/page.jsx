'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box, Typography, Paper, Button, Chip, IconButton, CircularProgress, Snackbar, Alert,
} from '@mui/material';
import { IconPlus, IconPencil, IconTrash, IconRefresh, IconFile } from '@tabler/icons-react';

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

export default function AdminSitePagesListPage() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-pages', { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setPages(data.pages || []);
      else showSnackbar(data.error || 'Failed to load pages', 'error');
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!can('pages.view')) router.replace('/admin/dashboard');
  }, [router]);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const handleDelete = async (id, title) => {
    if (!can('pages.delete')) return;
    if (!window.confirm(`Delete page "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/site-pages/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showSnackbar('Page deleted');
        fetchPages();
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
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Site Pages</Typography>
          <Typography variant="body2" color="text.secondary">
            CMS pages at /{'{slug}'} (imported from WordPress; static built pages are never overridden).
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<IconRefresh size={16} />} onClick={fetchPages} sx={{ textTransform: 'none', borderRadius: 2 }}>
            Refresh
          </Button>
          {can('pages.create') && (
            <Button
              variant="contained"
              component={Link}
              href="/admin/dashboard/site-pages/new/edit"
              startIcon={<IconPlus size={16} />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              New Page
            </Button>
          )}
        </Box>
      </Box>

      {!pages.length ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '2px dashed #e5eaef', borderRadius: 2 }}>
          <IconFile size={36} stroke={1.2} style={{ opacity: 0.35, marginBottom: 8 }} />
          <Typography color="text.secondary">No site pages yet. Run WP import or create one manually.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {pages.map((page) => (
            <Paper key={page.id} elevation={0} sx={{ p: 2, border: '1px solid #e5eaef', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={600}>{page.title}</Typography>
                <Typography variant="body2" color="text.secondary">/{page.slug}</Typography>
              </Box>
              <Chip label={page.status} size="small" color={page.status === 'published' ? 'success' : 'default'} />
              {page.wpPostId && <Chip label="WP import" size="small" variant="outlined" />}
              {can('pages.edit') && (
                <IconButton component={Link} href={`/admin/dashboard/site-pages/${page.id}/edit`} size="small">
                  <IconPencil size={18} />
                </IconButton>
              )}
              {can('pages.delete') && (
                <IconButton size="small" color="error" onClick={() => handleDelete(page.id, page.title)}>
                  <IconTrash size={18} />
                </IconButton>
              )}
            </Paper>
          ))}
        </Box>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
