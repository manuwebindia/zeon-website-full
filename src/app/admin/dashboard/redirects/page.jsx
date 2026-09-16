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
} from '@mui/material';
import Link from 'next/link';
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconRefresh,
  IconSearch,
  IconArrowRight,
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconRoute,
  IconArrowsExchange,
  IconFlask,
  IconAlertCircle,
  IconTrendingUp,
} from '@tabler/icons-react';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('zeon_admin_token') : '';
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

const EMPTY_FORM = {
  source: '',
  destination: '',
  statusCode: 301,
  matchType: 'exact',
  notes: '',
  isActive: true,
};

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, hits: 0, permanent: 0, temporary: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | active | inactive
  const [filterCode, setFilterCode] = useState('all'); // all | 301 | 302
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Dialogs
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Testing Dialog
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchRedirects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/redirects', { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        setRedirects(data.redirects || []);
        if (data.stats) setStats(data.stats);
      } else {
        showSnackbar(data.error || 'Failed to load redirects', 'error');
      }
    } catch {
      showSnackbar('Network error while loading redirects', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRedirects();
  }, [fetchRedirects]);

  // Filtered redirects
  const filteredRedirects = useMemo(() => {
    return redirects.filter((r) => {
      // Search
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.source.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q));

      // Status
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && r.isActive) ||
        (filterStatus === 'inactive' && !r.isActive);

      // Code
      const matchesCode =
        filterCode === 'all' || r.statusCode === Number(filterCode);

      return matchesSearch && matchesStatus && matchesCode;
    });
  }, [redirects, search, filterStatus, filterCode]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (rule) => {
    setEditingId(rule.id);
    setForm({
      source: rule.source,
      destination: rule.destination,
      statusCode: rule.statusCode || 301,
      matchType: rule.matchType || 'exact',
      notes: rule.notes || '',
      isActive: rule.isActive !== false,
    });
    setFormDialogOpen(true);
  };

  const handleSaveForm = async () => {
    if (!form.source.trim() || !form.destination.trim()) {
      showSnackbar('Source and Destination URLs are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/admin/redirects/${editingId}` : '/api/admin/redirects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        showSnackbar(editingId ? 'Redirect updated' : 'Redirect created');
        setRedirects(data.redirects || []);
        setFormDialogOpen(false);
        fetchRedirects();
      } else {
        showSnackbar(data.error || 'Failed to save redirect', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (rule) => {
    try {
      const res = await fetch(`/api/admin/redirects/${rule.id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ isActive: !rule.isActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setRedirects(data.redirects || []);
        showSnackbar(`Redirect rule ${!rule.isActive ? 'activated' : 'deactivated'}`);
        fetchRedirects();
      } else {
        showSnackbar(data.error || 'Failed to update rule status', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    }
  };

  const handleDelete = async (rule) => {
    if (!window.confirm(`Delete redirection for "${rule.source}"?`)) return;
    try {
      const res = await fetch(`/api/admin/redirects/${rule.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setRedirects(data.redirects || []);
        showSnackbar('Redirect deleted');
        fetchRedirects();
      } else {
        showSnackbar(data.error || 'Failed to delete redirect', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    }
  };

  const handleTestRedirect = async () => {
    if (!testUrl.trim()) return;
    setTesting(true);
    try {
      const res = await fetch('/api/admin/redirects', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'test', url: testUrl.trim() }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      showSnackbar('Network error while testing URL', 'error');
    } finally {
      setTesting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            URL Redirections
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Prevent broken links and protect SEO rankings with automatic 301 and 302 redirects.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<IconFlask size={16} />}
            onClick={() => {
              setTestUrl('');
              setTestResult(null);
              setTestDialogOpen(true);
            }}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Test URL
          </Button>
          <Button
            variant="contained"
            startIcon={<IconPlus size={16} />}
            onClick={handleOpenAdd}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Add Redirection
          </Button>
          <Button
            variant="outlined"
            startIcon={<IconRefresh size={16} />}
            onClick={fetchRedirects}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e5eaef', borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Total Rules
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                {stats.total}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#EEF2F6', color: '#1E293B' }}>
              <IconRoute size={24} />
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e5eaef', borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Active Rules
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: '#16A34A' }}>
                {stats.active}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#DCFCE7', color: '#16A34A' }}>
              <IconCheck size={24} />
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e5eaef', borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                301 Permanent
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: '#2563EB' }}>
                {stats.permanent}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#DBEAFE', color: '#2563EB' }}>
              <IconArrowsExchange size={24} />
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e5eaef', borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Total Hits Redirected
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                {stats.hits}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#FEF3C7', color: '#D97706' }}>
              <IconTrendingUp size={24} />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Filter and Search Bar */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #e5eaef', borderRadius: 2.5, mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search source, destination, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 240 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={16} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            size="small"
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active Only</MenuItem>
            <MenuItem value="inactive">Inactive Only</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Redirect Type"
            value={filterCode}
            onChange={(e) => setFilterCode(e.target.value)}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="301">301 (Permanent)</MenuItem>
            <MenuItem value="302">302 (Temporary)</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Redirects Table */}
      <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                  Source Path (From)
                </TableCell>
                <TableCell sx={{ width: 40, p: 0 }} />
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                  Destination (To)
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                  Hits
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                  Notes
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : filteredRedirects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <IconRoute size={40} color="#94a3b8" />
                      <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
                        No redirections found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {search || filterStatus !== 'all' || filterCode !== 'all'
                          ? 'Try clearing your filters'
                          : 'Click "Add Redirection" to create your first redirect rule'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRedirects.map((rule) => (
                  <TableRow
                    key={rule.id}
                    sx={{
                      '&:hover': { bgcolor: '#F8FAFC' },
                      opacity: rule.isActive ? 1 : 0.6,
                    }}
                  >
                    {/* Source */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            color: '#0f172a',
                            bgcolor: '#f1f5f9',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            maxWidth: 240,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {rule.source}
                        </Typography>
                        <Tooltip title="Copy path">
                          <IconButton size="small" onClick={() => copyToClipboard(rule.source)}>
                            <IconCopy size={14} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    {/* Arrow */}
                    <TableCell sx={{ p: 0 }}>
                      <IconArrowRight size={16} color="#64748b" />
                    </TableCell>

                    {/* Destination */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 500,
                            color: '#2563eb',
                            maxWidth: 260,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {rule.destination}
                        </Typography>
                        <Tooltip title="Open destination">
                          <IconButton
                            size="small"
                            component={Link}
                            href={rule.destination}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconExternalLink size={14} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <Chip
                        label={`${rule.statusCode || 301} ${rule.statusCode === 302 ? 'Temp' : 'Perm'}`}
                        size="small"
                        color={rule.statusCode === 302 ? 'warning' : 'primary'}
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.72rem', height: 22 }}
                      />
                      {rule.matchType === 'prefix' && (
                        <Chip
                          label="Wildcard"
                          size="small"
                          sx={{ ml: 0.5, fontSize: '0.68rem', height: 20 }}
                        />
                      )}
                    </TableCell>

                    {/* Active Toggle */}
                    <TableCell>
                      <Tooltip title={rule.isActive ? 'Active — click to disable' : 'Inactive — click to enable'}>
                        <Switch
                          size="small"
                          checked={Boolean(rule.isActive)}
                          onChange={() => handleToggleActive(rule)}
                          color="success"
                        />
                      </Tooltip>
                    </TableCell>

                    {/* Hits */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {rule.hits || 0}
                      </Typography>
                      {rule.lastHitAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                          {new Date(rule.lastHitAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </TableCell>

                    {/* Notes */}
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '0.8rem',
                        }}
                      >
                        {rule.notes || '—'}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenEdit(rule)}>
                          <IconPencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(rule)}>
                          <IconTrash size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add / Edit Redirection Dialog */}
      <Dialog
        open={formDialogOpen}
        onClose={() => !saving && setFormDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingId ? 'Edit URL Redirection' : 'Add URL Redirection'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Specify the incoming source URL to match and where visitors should be redirected.
          </Typography>

          <TextField
            fullWidth
            label="Source Path (From)"
            placeholder="e.g. /courses/old-marketing or /wp-content/*"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            helperText="The old URL path that should be redirected. Use /* at the end for wildcard matching."
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Destination URL (To)"
            placeholder="e.g. /courses/advanced-digital-marketing or https://..."
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            helperText="The target page path (e.g. /courses) or full external URL (https://...)."
            sx={{ mb: 2.5 }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
            <TextField
              select
              fullWidth
              label="Redirect Type"
              value={form.statusCode}
              onChange={(e) => setForm({ ...form, statusCode: Number(e.target.value) })}
              helperText="301 is best for SEO link juice"
            >
              <MenuItem value={301}>301 — Permanent</MenuItem>
              <MenuItem value={302}>302 — Temporary</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Match Type"
              value={form.matchType}
              onChange={(e) => setForm({ ...form, matchType: e.target.value })}
              helperText="Exact path or prefix match"
            >
              <MenuItem value="exact">Exact Match</MenuItem>
              <MenuItem value="prefix">Prefix / Subpath</MenuItem>
            </TextField>
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Notes / Reason (Optional)"
            placeholder="e.g. Renamed course page during 2026 update"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                color="success"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Enable this redirection immediately
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormDialogOpen(false)} disabled={saving} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveForm}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconCheck size={16} />}
            sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
          >
            {saving ? 'Saving…' : editingId ? 'Update Redirect' : 'Create Redirect'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Test URL Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Test Redirection Matching</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Enter any URL path to check which active redirect rule intercepts it and where it sends visitors.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. /courses/digital-marketing"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTestRedirect()}
            />
            <Button
              variant="contained"
              onClick={handleTestRedirect}
              disabled={testing || !testUrl.trim()}
              sx={{ textTransform: 'none', borderRadius: 2, px: 3, whiteSpace: 'nowrap' }}
            >
              {testing ? <CircularProgress size={16} color="inherit" /> : 'Test'}
            </Button>
          </Box>

          {testResult && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: testResult.matched ? '#bbf7d0' : '#fecaca',
                bgcolor: testResult.matched ? '#f0fdf4' : '#fef2f2',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {testResult.matched ? (
                  <Chip label="Match Found!" color="success" size="small" sx={{ fontWeight: 700 }} />
                ) : (
                  <Chip label="No Match Found" color="error" size="small" sx={{ fontWeight: 700 }} />
                )}
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                  {testResult.testedUrl}
                </Typography>
              </Box>

              {testResult.matched && testResult.rule && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Redirects to:</strong>{' '}
                    <code style={{ background: '#fff', padding: '2px 6px', borderRadius: 4 }}>
                      {testResult.rule.matchedDestination}
                    </code>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>HTTP Status:</strong> {testResult.rule.statusCode} ({testResult.rule.statusCode === 301 ? 'Permanent' : 'Temporary'})
                  </Typography>
                  <Typography variant="body2">
                    <strong>Rule Pattern:</strong> {testResult.rule.source} ({testResult.rule.matchType})
                  </Typography>
                </Box>
              )}

              {!testResult.matched && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  This URL will continue to the normal page router without being redirected.
                </Typography>
              )}
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTestDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
