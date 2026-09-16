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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControlLabel,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Rating,
  Checkbox,
} from '@mui/material';
import Link from 'next/link';
import {
  IconStar,
  IconPlus,
  IconPencil,
  IconTrash,
  IconRefresh,
  IconSearch,
  IconExternalLink,
  IconSettings,
  IconCheck,
  IconAlertCircle,
  IconMessage2,
  IconBuildingStore,
  IconMapPin,
  IconShare,
} from '@tabler/icons-react';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('zeon_admin_token') : '';
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

// Google G 4-Color Icon
const GoogleGIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4" />
    <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853" />
    <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z" fill="#FBBC05" />
    <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
  </svg>
);

const EMPTY_FORM = {
  authorName: '',
  authorPhoto: '',
  rating: 5,
  text: '',
  relativeTime: 'Recently',
  isLocalGuide: false,
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    fiveStar: 0,
    googleRating: 4.9,
    googleReviewCount: 181,
    lastSyncedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Dialogs
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Settings Dialog
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    minRating: 4,
    placeId: '',
    apiKey: '',
  });

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews', { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setPlaceDetails(data.placeDetails || null);
        setSettings(data.settings || null);
        if (data.stats) setStats(data.stats);
        if (data.settings) {
          setSettingsForm({
            minRating: data.settings.minRating || 4,
            placeId: data.placeDetails?.placeId || '',
            apiKey: '',
          });
        }
      } else {
        showSnackbar(data.error || 'Failed to load reviews', 'error');
      }
    } catch (err) {
      showSnackbar('Error loading reviews: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Sync with Google Places API
  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/reviews/sync', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showSnackbar(data.message || 'Successfully synced with Google Places API!');
        await fetchReviews();
      } else {
        showSnackbar(data.error || 'Failed to sync with Google Places API', 'error');
      }
    } catch (err) {
      showSnackbar('Sync failed: ' + err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isActive: !currentStatus } : r))
        );
        showSnackbar(`Review marked as ${!currentStatus ? 'Active' : 'Hidden'}`);
      } else {
        const data = await res.json();
        showSnackbar(data.error || 'Failed to update review status', 'error');
      }
    } catch (err) {
      showSnackbar('Update failed: ' + err.message, 'error');
    }
  };

  // Open Form for Create
  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormDialogOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (rev) => {
    setEditingId(rev.id);
    setForm({
      authorName: rev.authorName || '',
      authorPhoto: rev.authorPhoto || '',
      rating: rev.rating || 5,
      text: rev.text || '',
      relativeTime: rev.relativeTime || 'Recently',
      isLocalGuide: Boolean(rev.isLocalGuide),
    });
    setFormDialogOpen(true);
  };

  // Save Form (Create or Edit)
  const handleSaveForm = async () => {
    if (!form.authorName.trim() || !form.text.trim()) {
      showSnackbar('Author name and review text are required.', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/reviews/${editingId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(form),
        });
        if (res.ok) {
          showSnackbar('Review updated successfully!');
          setFormDialogOpen(false);
          await fetchReviews();
        } else {
          const data = await res.json();
          showSnackbar(data.error || 'Failed to update review', 'error');
        }
      } else {
        const res = await fetch('/api/admin/reviews', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(form),
        });
        if (res.ok) {
          showSnackbar('New review added successfully!');
          setFormDialogOpen(false);
          await fetchReviews();
        } else {
          const data = await res.json();
          showSnackbar(data.error || 'Failed to create review', 'error');
        }
      }
    } catch (err) {
      showSnackbar('Save failed: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (id, authorName) => {
    if (!window.confirm(`Are you sure you want to delete the review by "${authorName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        showSnackbar('Review deleted successfully!');
      } else {
        const data = await res.json();
        showSnackbar(data.error || 'Failed to delete review', 'error');
      }
    } catch (err) {
      showSnackbar('Delete failed: ' + err.message, 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          settings: {
            minRating: Number(settingsForm.minRating) || 4,
          },
          placeDetails: settingsForm.placeId ? { placeId: settingsForm.placeId } : undefined,
        }),
      });
      if (res.ok) {
        showSnackbar('Review settings saved!');
        setSettingsDialogOpen(false);
        await fetchReviews();
      } else {
        const data = await res.json();
        showSnackbar(data.error || 'Failed to save settings', 'error');
      }
    } catch (err) {
      showSnackbar('Save settings failed: ' + err.message, 'error');
    }
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        !search ||
        r.authorName?.toLowerCase().includes(search.toLowerCase()) ||
        r.text?.toLowerCase().includes(search.toLowerCase());

      const matchesRating =
        filterRating === 'all' || (r.rating || 5) === Number(filterRating);

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && r.isActive !== false) ||
        (filterStatus === 'inactive' && r.isActive === false);

      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [reviews, search, filterRating, filterStatus]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* ── HEADER ── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GoogleGIcon size={28} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Google Reviews & Places API
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage Google Business Profile reviews, sync live ratings, and curate student testimonials for course pages.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<IconSettings size={18} />}
            onClick={() => setSettingsDialogOpen(true)}
            sx={{ borderRadius: '8px', textTransform: 'none', borderColor: '#CBD5E1', color: 'text.primary' }}
          >
            Settings
          </Button>

          <Button
            variant="outlined"
            startIcon={syncing ? <CircularProgress size={16} color="inherit" /> : <IconRefresh size={18} />}
            onClick={handleSync}
            disabled={syncing}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#2563EB',
              color: '#2563EB',
              '&:hover': { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF' },
            }}
          >
            {syncing ? 'Syncing...' : 'Sync from Google'}
          </Button>

          <Button
            variant="contained"
            startIcon={<IconPlus size={18} />}
            onClick={handleOpenCreate}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              backgroundColor: '#FF4444',
              '&:hover': { backgroundColor: '#CC2222' },
              boxShadow: '0 4px 12px rgba(255,68,68,0.25)',
            }}
          >
            Add Review
          </Button>
        </Box>
      </Box>

      {/* ── STATS CARDS ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Google Rating
              </Typography>
              <GoogleGIcon size={20} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A' }}>
                {placeDetails?.rating || 4.9}
              </Typography>
              <Rating value={placeDetails?.rating || 4.9} precision={0.1} readOnly size="small" sx={{ color: '#FBBC04' }} />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              Live from Google Places API
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Google Reviews Count
              </Typography>
              <IconBuildingStore size={20} color="#2563EB" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2563EB' }}>
              {placeDetails?.userRatingCount || 181}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              Total verified reviews on GBP
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Active on Site
              </Typography>
              <IconCheck size={20} color="#16A34A" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#16A34A' }}>
              {stats.active}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              Curated reviews displayed on site
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Last Synced
              </Typography>
              <IconRefresh size={20} color="#EA580C" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
              {placeDetails?.lastSyncedAt
                ? new Date(placeDetails.lastSyncedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Never'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              Automatic & on-demand sync
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ── GOOGLE PROFILE BANNER ── */}
      {placeDetails && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: '12px',
            border: '1px solid #BFDBFE',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <GoogleGIcon size={24} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E3A8A' }}>
                {placeDetails.displayName} — Google Business Profile
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconMapPin size={14} /> {placeDetails.formattedAddress || 'Kochi, Kerala'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              component="a"
              href={placeDetails.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              endIcon={<IconExternalLink size={14} />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                backgroundColor: '#FFFFFF',
                borderColor: '#BFDBFE',
                color: '#1D4ED8',
                fontWeight: 600,
              }}
            >
              View on Google Maps
            </Button>

            <Button
              component="a"
              href={placeDetails.reviewDialogUri}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="contained"
              endIcon={<IconShare size={14} />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                backgroundColor: '#2563EB',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#1D4ED8' },
              }}
            >
              Write Review Link
            </Button>
          </Box>
        </Paper>
      )}

      {/* ── FILTER & SEARCH BAR ── */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder="Search by student name or review text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: { xs: '100%', sm: 260 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={18} color="#94A3B8" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          size="small"
          label="Rating"
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">All Stars</MenuItem>
          <MenuItem value="5">5 Stars only</MenuItem>
          <MenuItem value="4">4 Stars</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active only</MenuItem>
          <MenuItem value="inactive">Hidden only</MenuItem>
        </TextField>
      </Paper>

      {/* ── REVIEWS TABLE ── */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={36} sx={{ color: '#FF4444' }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Loading Google Reviews...
            </Typography>
          </Box>
        ) : filteredReviews.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <IconMessage2 size={40} color="#94A3B8" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1, color: 'text.primary' }}>
              No reviews found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Try adjusting your search filter or click &quot;Sync from Google&quot; to fetch latest reviews.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>REVIEWER</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>RATING</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>REVIEW COMMENT</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>DATE / SOURCE</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                    ON SITE
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReviews.map((rev) => (
                  <TableRow key={rev.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    {/* Reviewer */}
                    <TableCell sx={{ minWidth: 180 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: '#2563EB',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            flexShrink: 0,
                          }}
                        >
                          {rev.authorInitial || rev.authorName?.[0]?.toUpperCase() || 'G'}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                            {rev.authorName}
                          </Typography>
                          {rev.isLocalGuide && (
                            <Chip
                              label="Local Guide"
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                backgroundColor: '#FEF3C7',
                                color: '#92400E',
                                mt: 0.5,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Rating */}
                    <TableCell sx={{ minWidth: 120 }}>
                      <Rating value={rev.rating || 5} readOnly size="small" sx={{ color: '#FBBC04' }} />
                    </TableCell>

                    {/* Review Text */}
                    <TableCell sx={{ maxWidth: 360 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#334155',
                          fontSize: '0.825rem',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {rev.text}
                      </Typography>
                    </TableCell>

                    {/* Date / Source */}
                    <TableCell sx={{ minWidth: 140 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary' }}>
                        {rev.relativeTime || 'Recently'}
                      </Typography>
                      <Chip
                        label={rev.source === 'google_places_api' ? 'Google API' : 'Manual'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.675rem',
                          fontWeight: 600,
                          backgroundColor: rev.source === 'google_places_api' ? '#EFF6FF' : '#F1F5F9',
                          color: rev.source === 'google_places_api' ? '#1E40AF' : '#475569',
                          mt: 0.5,
                        }}
                      />
                    </TableCell>

                    {/* Active toggle */}
                    <TableCell align="center">
                      <Tooltip title={rev.isActive !== false ? 'Displayed on website' : 'Hidden from website'}>
                        <Switch
                          checked={rev.isActive !== false}
                          onChange={() => handleToggleActive(rev.id, rev.isActive !== false)}
                          color="success"
                          size="small"
                        />
                      </Tooltip>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Edit Review">
                          <IconButton size="small" onClick={() => handleOpenEdit(rev)} sx={{ color: '#64748B' }}>
                            <IconPencil size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Review">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteReview(rev.id, rev.authorName)}
                            sx={{ color: '#EF4444' }}
                          >
                            <IconTrash size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ── ADD / EDIT REVIEW DIALOG ── */}
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingId ? 'Edit Review' : 'Add New Student Review'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Student / Reviewer Name *"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              fullWidth
              size="small"
              placeholder="e.g. Abhijith Nair"
            />

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Rating (Stars)
              </Typography>
              <Rating
                value={Number(form.rating) || 5}
                onChange={(_, val) => setForm({ ...form, rating: val || 5 })}
                size="large"
                sx={{ color: '#FBBC04' }}
              />
            </Box>

            <TextField
              label="Relative Date / Time"
              value={form.relativeTime}
              onChange={(e) => setForm({ ...form, relativeTime: e.target.value })}
              fullWidth
              size="small"
              placeholder="e.g. 2 weeks ago, 1 month ago"
            />

            <TextField
              label="Review Text *"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              fullWidth
              multiline
              rows={4}
              placeholder="Paste Google review comments here..."
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isLocalGuide}
                  onChange={(e) => setForm({ ...form, isLocalGuide: e.target.checked })}
                  color="primary"
                />
              }
              label="Mark as Google Local Guide review"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setFormDialogOpen(false)} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveForm}
            disabled={saving}
            sx={{
              backgroundColor: '#FF4444',
              '&:hover': { backgroundColor: '#CC2222' },
              textTransform: 'none',
              borderRadius: '8px',
            }}
          >
            {saving ? 'Saving...' : editingId ? 'Update Review' : 'Save Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── SETTINGS DIALOG ── */}
      <Dialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Google Reviews Settings</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Minimum Star Rating to Display on Site"
              type="number"
              size="small"
              inputProps={{ min: 1, max: 5 }}
              value={settingsForm.minRating}
              onChange={(e) => setSettingsForm({ ...form, minRating: Number(e.target.value) || 4 })}
              helperText="Reviews below this star rating will not be shown on public course pages."
              fullWidth
            />

            <TextField
              label="Google Place ID (Optional override)"
              size="small"
              value={settingsForm.placeId}
              onChange={(e) => setSettingsForm({ ...settingsForm, placeId: e.target.value })}
              helperText="Leave default to use GOOGLE_PLACE_ID from .env.local"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSettingsDialogOpen(false)} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            sx={{
              backgroundColor: '#2563EB',
              '&:hover': { backgroundColor: '#1D4ED8' },
              textTransform: 'none',
              borderRadius: '8px',
            }}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── SNACKBAR ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
