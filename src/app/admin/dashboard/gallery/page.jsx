'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from '@mui/material';
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconRefresh,
  IconPhoto,
  IconVideo,
  IconSearch,
  IconExternalLink,
  IconFolder,
  IconCheck,
  IconClock,
  IconCalendar,
} from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, album: null });
  const [deleting, setDeleting] = useState(false);
  const [dateDialog, setDateDialog] = useState({ open: false, album: null, date: '' });
  const [savingDate, setSavingDate] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery', { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        setAlbums(data.albums || []);
      } else {
        showSnackbar(data.error || 'Failed to load albums', 'error');
      }
    } catch {
      showSnackbar('Network error while fetching albums', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!can('gallery.view')) router.replace('/admin/dashboard');
  }, [router]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  // Distinct categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set();
    albums.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [albums]);

  // Filtered albums
  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const matchesSearch =
        !searchQuery.trim() ||
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (album.category && album.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' || album.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' || album.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [albums, searchQuery, statusFilter, categoryFilter]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = albums.length;
    const published = albums.filter((a) => a.status === 'published').length;
    const drafts = total - published;
    const photos = albums.reduce((sum, a) => sum + (a.photosCount ?? a._count?.images ?? 0), 0);
    const videos = albums.reduce((sum, a) => sum + (a.videosCount ?? 0), 0);
    return { total, published, drafts, photos, videos };
  }, [albums]);

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.album) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery/${deleteDialog.album.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showSnackbar('Album deleted successfully');
        setDeleteDialog({ open: false, album: null });
        fetchAlbums();
      } else {
        const data = await res.json();
        showSnackbar(data.error || 'Delete failed', 'error');
      }
    } catch {
      showSnackbar('Network error while deleting', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveDateOverride = async () => {
    if (!dateDialog.album) return;
    setSavingDate(true);
    try {
      const res = await fetch(`/api/admin/gallery/${dateDialog.album.id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ eventDate: dateDialog.date || null }),
      });
      if (res.ok) {
        showSnackbar(`Date overridden for "${dateDialog.album.title}"`);
        setDateDialog({ open: false, album: null, date: '' });
        fetchAlbums();
      } else {
        const data = await res.json();
        showSnackbar(data.error || 'Failed to override date', 'error');
      }
    } catch {
      showSnackbar('Network error while overriding date', 'error');
    } finally {
      setSavingDate(false);
    }
  };

  if (loading && !albums.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 14 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Gallery CMS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage photo & video albums, groups, inner media items, and covers shown on /gallery.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<IconRefresh size={16} />}
            onClick={fetchAlbums}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Refresh
          </Button>
          <Button
            component={Link}
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            startIcon={<IconExternalLink size={16} />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Live Gallery
          </Button>
          {can('gallery.create') && (
            <Button
              variant="contained"
              component={Link}
              href="/admin/dashboard/gallery/new/edit"
              startIcon={<IconPlus size={16} />}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
            >
              Add Album / Group
            </Button>
          )}
        </Box>
      </Box>

      {/* Overview Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e5eaef', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(26, 79, 214, 0.08)', color: '#1A4FD6' }}>
                <IconFolder size={20} />
              </Box>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Total Albums
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={800}>{stats.total}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e5eaef', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(23, 198, 83, 0.08)', color: '#17C653' }}>
                <IconCheck size={20} />
              </Box>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Published
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={800} color="success.main">{stats.published}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e5eaef', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255, 68, 68, 0.08)', color: '#FF4444' }}>
                <IconPhoto size={20} />
              </Box>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Total Photos
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={800}>{stats.photos}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e5eaef', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255, 152, 0, 0.08)', color: '#ff9800' }}>
                <IconVideo size={20} />
              </Box>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Total Videos
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={800}>{stats.videos}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters & Search Toolbar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e5eaef', borderRadius: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search albums by title, slug, or group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size={18} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Category / Group"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* CMS Albums Table */}
      {!filteredAlbums.length ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '2px dashed #e5eaef', borderRadius: 3 }}>
          <IconPhoto size={44} stroke={1.2} style={{ opacity: 0.35, marginBottom: 12 }} />
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            No gallery albums found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            {albums.length ? 'Try changing your search or filter options.' : 'Create your first gallery album to display photos and videos.'}
          </Typography>
          {can('gallery.create') && (
            <Button
              variant="contained"
              component={Link}
              href="/admin/dashboard/gallery/new/edit"
              startIcon={<IconPlus size={16} />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Create First Album
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 100 }}>Cover</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Album / Group</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Media Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlbums.map((album) => {
                const photos = album.photosCount ?? album._count?.images ?? 0;
                const videos = album.videosCount ?? 0;
                return (
                  <TableRow key={album.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      {album.coverImage ? (
                        <Box
                          component="img"
                          src={album.coverImage}
                          alt=""
                          sx={{
                            width: 72,
                            height: 52,
                            objectFit: 'cover',
                            borderRadius: 1.5,
                            border: '1px solid #e5eaef',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 72,
                            height: 52,
                            bgcolor: '#f1f5f9',
                            borderRadius: 1.5,
                            border: '1px solid #e5eaef',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.disabled',
                          }}
                        >
                          <IconPhoto size={22} stroke={1.2} />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary' }}>
                        {album.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontFamily: 'monospace' }}>
                        /gallery/{album.slug}
                      </Typography>
                      {album.category && (
                        <Chip
                          label={album.category}
                          size="small"
                          sx={{ mt: 0.5, height: 20, fontSize: '0.68rem', bgcolor: '#F1F5F9', fontWeight: 600 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<IconPhoto size={14} />}
                          label={`${photos} photo${photos === 1 ? '' : 's'}`}
                          size="small"
                          variant="outlined"
                          sx={{ height: 24, fontSize: '0.75rem', fontWeight: 500 }}
                        />
                        {videos > 0 && (
                          <Chip
                            icon={<IconVideo size={14} />}
                            label={`${videos} video${videos === 1 ? '' : 's'}`}
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={album.status === 'published' ? 'Published' : 'Draft'}
                        size="small"
                        color={album.status === 'published' ? 'success' : 'default'}
                        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Click to override date">
                        <Box
                          component="button"
                          type="button"
                          onClick={() =>
                            setDateDialog({
                              open: true,
                              album,
                              date: album.eventDate ? album.eventDate.slice(0, 10) : '',
                            })
                          }
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.8,
                            cursor: 'pointer',
                            px: 1.2,
                            py: 0.6,
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: album.eventDate ? '#e2e8f0' : '#f1f5f9',
                            bgcolor: album.eventDate ? '#fff' : '#f8fafc',
                            transition: 'all 0.15s',
                            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' },
                          }}
                        >
                          <IconCalendar size={14} style={{ color: album.eventDate ? '#1A4FD6' : '#94a3b8' }} />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.8rem',
                              fontWeight: album.eventDate ? 600 : 500,
                              color: album.eventDate ? 'text.primary' : 'text.secondary',
                            }}
                          >
                            {album.eventDate
                              ? new Date(album.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                              : 'Set Date'}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          component={Link}
                          href={`/gallery/${album.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          title="View Live Page"
                        >
                          <IconExternalLink size={17} />
                        </IconButton>
                        {can('gallery.edit') && (
                          <IconButton
                            component={Link}
                            href={`/admin/dashboard/gallery/${album.id}/edit`}
                            size="small"
                            color="primary"
                            title="Edit Album & Media"
                          >
                            <IconPencil size={17} />
                          </IconButton>
                        )}
                        {can('gallery.delete') && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, album })}
                            title="Delete Album"
                          >
                            <IconTrash size={17} />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Quick Date Override Dialog */}
      <Dialog
        open={dateDialog.open}
        onClose={() => setDateDialog({ open: false, album: null, date: '' })}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Override Album Date
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set the event / display date for <strong>&quot;{dateDialog.album?.title}&quot;</strong>. This overrides the published date on /gallery and the album page.
          </Typography>
          <TextField
            fullWidth
            type="date"
            label="Album Date"
            value={dateDialog.date}
            onChange={(e) => setDateDialog((p) => ({ ...p, date: e.target.value }))}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconCalendar size={18} />
                  </InputAdornment>
                ),
              },
            }}
            helperText={
              dateDialog.date
                ? `Display: ${new Date(dateDialog.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
                : 'Leave empty to use publish date'
            }
          />
          <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mt: 1.5, alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, fontSize: '0.72rem' }}>
              Quick:
            </Typography>
            <Chip
              label="Today"
              size="small"
              variant="outlined"
              clickable
              onClick={() => setDateDialog((p) => ({ ...p, date: new Date().toISOString().slice(0, 10) }))}
              sx={{ height: 22, fontSize: '0.7rem' }}
            />
            {['2025', '2024', '2023', '2022'].map((year) => (
              <Chip
                key={year}
                label={year}
                size="small"
                variant="outlined"
                clickable
                onClick={() => {
                  if (dateDialog.date && dateDialog.date.length >= 10) {
                    const parts = dateDialog.date.split('-');
                    setDateDialog((p) => ({ ...p, date: `${year}-${parts[1]}-${parts[2]}` }));
                  } else {
                    setDateDialog((p) => ({ ...p, date: `${year}-01-01` }));
                  }
                }}
                sx={{ height: 22, fontSize: '0.7rem' }}
              />
            ))}
            {dateDialog.date && (
              <Chip
                label="Clear"
                size="small"
                color="error"
                variant="outlined"
                clickable
                onClick={() => setDateDialog((p) => ({ ...p, date: '' }))}
                sx={{ height: 22, fontSize: '0.7rem' }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setDateDialog({ open: false, album: null, date: '' })}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveDateOverride}
            disabled={savingDate}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {savingDate ? 'Saving...' : 'Save Date'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, album: null })}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Album Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the album <strong>"{deleteDialog.album?.title}"</strong>?
            All associated inner images and videos will also be permanently removed from this album.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, album: null })}
            variant="outlined"
            disabled={deleting}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {deleting ? 'Deleting...' : 'Delete Album'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
