'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Snackbar, Alert, CircularProgress,
  Tooltip, ToggleButton, ToggleButtonGroup, Skeleton, Divider,
} from '@mui/material';
import {
  IconTrash, IconEye, IconRefresh, IconBriefcase, IconCheck, IconX,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

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
function formatDate(d) {
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_COLORS = { pending: 'warning', approved: 'success', rejected: 'error' };

export default function JobPostingsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [detailJob, setDetailJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!can('job-postings.view')) router.replace('/admin/dashboard');
  }, [router]);

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchJobs = useCallback(async (filter = statusFilter) => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await fetch(`/api/admin/job-postings${params}`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs || []);
        setCounts(data.counts || {});
      } else {
        showSnackbar(data.error || 'Failed to load job postings', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleFilterChange = (_, newFilter) => {
    if (newFilter === null) return;
    setStatusFilter(newFilter);
    fetchJobs(newFilter);
  };

  const updateStatus = async (id, status) => {
    if (!can('job-postings.edit')) return;
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/admin/job-postings/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        showSnackbar(status === 'approved' ? 'Job approved — now live on Placements' : 'Job rejected');
        setDetailJob(null);
        fetchJobs(statusFilter);
      } else {
        showSnackbar(data.error || 'Update failed', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setActionLoading('');
    }
  };

  const saveNotes = async () => {
    if (!detailJob || !can('job-postings.edit')) return;
    setActionLoading('notes');
    try {
      const res = await fetch(`/api/admin/job-postings/${detailJob.id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ adminNotes: editNotes }),
      });
      if (res.ok) {
        showSnackbar('Notes saved');
        setDetailJob((prev) => (prev ? { ...prev, adminNotes: editNotes } : prev));
        fetchJobs(statusFilter);
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !can('job-postings.delete')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/job-postings/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showSnackbar('Job posting deleted');
        setDeleteTarget(null);
        if (detailJob?.id === deleteTarget.id) setDetailJob(null);
        fetchJobs(statusFilter);
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const openDetail = (job) => {
    setDetailJob(job);
    setEditNotes(job.adminNotes || '');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Job Postings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review employer submissions. Approve to publish on the Placements page.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<IconRefresh size={16} />} onClick={() => fetchJobs()} sx={{ textTransform: 'none', borderRadius: 2 }}>
          Refresh
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, p: 2, mb: 3 }}>
        <ToggleButtonGroup
          exclusive
          value={statusFilter}
          onChange={handleFilterChange}
          size="small"
          sx={{ flexWrap: 'wrap' }}
        >
          {[
            { value: 'pending', label: `Pending (${counts.pending || 0})` },
            { value: 'approved', label: `Approved (${counts.approved || 0})` },
            { value: 'rejected', label: `Rejected (${counts.rejected || 0})` },
            { value: 'all', label: 'All' },
          ].map((opt) => (
            <ToggleButton key={opt.value} value={opt.value} sx={{ textTransform: 'none', borderRadius: '8px !important', mx: 0.5 }}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 700 }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Submitted</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(7)].map((__, j) => (
                        <TableCell key={j}><Skeleton height={24} /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : jobs.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <IconBriefcase size={32} stroke={1.2} style={{ opacity: 0.3, marginBottom: 8 }} />
                        <Typography color="text.secondary">No job postings in this filter.</Typography>
                      </TableCell>
                    </TableRow>
                  )
                  : jobs.map((job) => (
                    <TableRow key={job.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{job.jobTitle}</TableCell>
                      <TableCell>{job.companyName}</TableCell>
                      <TableCell>{job.location || '—'}</TableCell>
                      <TableCell>{job.phone}</TableCell>
                      <TableCell>
                        <Chip label={job.status} size="small" color={STATUS_COLORS[job.status] || 'default'} sx={{ textTransform: 'capitalize' }} />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{formatDate(job.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => openDetail(job)}><IconEye size={16} /></IconButton>
                        </Tooltip>
                        {job.status === 'pending' && can('job-postings.edit') && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                disabled={actionLoading === job.id + 'approved'}
                                onClick={() => updateStatus(job.id, 'approved')}
                              >
                                {actionLoading === job.id + 'approved' ? <CircularProgress size={16} /> : <IconCheck size={16} />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                disabled={actionLoading === job.id + 'rejected'}
                                onClick={() => updateStatus(job.id, 'rejected')}
                              >
                                {actionLoading === job.id + 'rejected' ? <CircularProgress size={16} /> : <IconX size={16} />}
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {can('job-postings.delete') && (
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => setDeleteTarget(job)}>
                              <IconTrash size={16} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={Boolean(detailJob)} onClose={() => setDetailJob(null)} maxWidth="sm" fullWidth>
        {detailJob && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>{detailJob.jobTitle}</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                {[
                  ['Company', detailJob.companyName],
                  ['Phone', detailJob.phone],
                  ['Location', detailJob.location],
                  ['Job Types', detailJob.jobTypes],
                  ['Shift & Schedule', detailJob.shiftSchedule],
                  ['About Company', detailJob.aboutCompany],
                  ['Skills Required', detailJob.skillsRequired],
                  ['Eligibility', detailJob.eligibility],
                  ['Status', detailJob.status],
                  ['Submitted', formatDate(detailJob.createdAt)],
                  ['Source', detailJob.source],
                ].map(([label, value]) => (
                  value ? (
                    <Box key={label}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>{label}</Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{value}</Typography>
                    </Box>
                  ) : null
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Admin Notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                disabled={!can('job-postings.edit')}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
              {detailJob.status === 'pending' && can('job-postings.edit') && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<IconCheck size={16} />}
                    onClick={() => updateStatus(detailJob.id, 'approved')}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Approve & Publish
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<IconX size={16} />}
                    onClick={() => updateStatus(detailJob.id, 'rejected')}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Reject
                  </Button>
                </>
              )}
              {can('job-postings.edit') && (
                <Button onClick={saveNotes} disabled={actionLoading === 'notes'} sx={{ textTransform: 'none', borderRadius: 2 }}>
                  Save Notes
                </Button>
              )}
              <Button onClick={() => setDetailJob(null)} sx={{ textTransform: 'none', borderRadius: 2 }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete job posting?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Delete <strong>{deleteTarget?.jobTitle}</strong> at {deleteTarget?.companyName}? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting} sx={{ textTransform: 'none' }}>
            {deleting ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
