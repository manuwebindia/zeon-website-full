'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, Paper, Button, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Snackbar, Alert, CircularProgress,
  Tooltip, ToggleButton, ToggleButtonGroup, Skeleton, Divider,
  InputAdornment, MenuItem, FormControl, InputLabel, Select,
} from '@mui/material';
import {
  IconTrash, IconEye, IconRefresh, IconBriefcase, IconCheck, IconX,
  IconPlus, IconEdit, IconSearch, IconFolder, IconCloudUpload, IconPhoto,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
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
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_COLORS = { pending: 'warning', approved: 'success', rejected: 'error' };

const INITIAL_FORM = {
  jobTitle: '',
  companyName: '',
  companyLogo: '',
  phone: '',
  location: '',
  jobTypes: 'Full-time',
  shiftSchedule: 'Day Shift',
  aboutCompany: '',
  skillsRequired: '',
  eligibility: '',
  status: 'approved',
  adminNotes: '',
};

export default function JobPostingsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailJob, setDetailJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // CMS Edit / Create Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // null = create new, object = edit existing
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Logo Picker & Upload state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef(null);

  const canEdit = can('job-postings.edit') || can('job-postings.create');
  const canDelete = can('job-postings.delete');

  useEffect(() => {
    if (!can('job-postings.view')) router.replace('/admin/dashboard');
  }, [router]);

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchJobs = useCallback(async (filter = statusFilter, search = searchQuery) => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams();
      if (filter && filter !== 'all') qParams.set('status', filter);
      if (search.trim()) qParams.set('search', search.trim());
      const queryString = qParams.toString() ? `?${qParams.toString()}` : '';

      const res = await fetch(`/api/admin/job-postings${queryString}`, { headers: authHeaders() });
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
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (_, newFilter) => {
    if (newFilter === null) return;
    setStatusFilter(newFilter);
    fetchJobs(newFilter, searchQuery);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(statusFilter, searchQuery);
  };

  const updateStatus = async (id, status) => {
    if (!canEdit) return;
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/admin/job-postings/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        showSnackbar(status === 'approved' ? 'Job approved — live on Placements' : `Job status changed to ${status}`);
        if (detailJob?.id === id) {
          setDetailJob((prev) => (prev ? { ...prev, status } : prev));
        }
        fetchJobs(statusFilter, searchQuery);
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
    if (!detailJob || !canEdit) return;
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
        fetchJobs(statusFilter, searchQuery);
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !canDelete) return;
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
        fetchJobs(statusFilter, searchQuery);
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

  // Open Create Job Dialog
  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setFormOpen(true);
  };

  // Open Edit Job Dialog
  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setFormData({
      jobTitle: job.jobTitle || '',
      companyName: job.companyName || '',
      companyLogo: job.companyLogo || '',
      phone: job.phone || '',
      location: job.location || '',
      jobTypes: job.jobTypes || 'Full-time',
      shiftSchedule: job.shiftSchedule || 'Day Shift',
      aboutCompany: job.aboutCompany || '',
      skillsRequired: job.skillsRequired || '',
      eligibility: job.eligibility || '',
      status: job.status || 'pending',
      adminNotes: job.adminNotes || '',
    });
    setFormErrors({});
    setFormOpen(true);
  };

  // Direct file upload for company logo
  const handleLogoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar('Logo file size must be less than 5MB', 'error');
      return;
    }
    setUploadingLogo(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: data,
      });
      const result = await res.json();
      if (res.ok && result.url) {
        setFormData((prev) => ({ ...prev, companyLogo: result.url }));
        showSnackbar('Company logo uploaded successfully');
      } else {
        showSnackbar(result.error || 'Upload failed', 'error');
      }
    } catch {
      showSnackbar('Network error while uploading logo', 'error');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.jobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveForm = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      if (editingJob) {
        // PATCH existing job
        const res = await fetch(`/api/admin/job-postings/${editingJob.id}`, {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          showSnackbar('Job posting updated successfully');
          setFormOpen(false);
          if (detailJob?.id === editingJob.id) {
            setDetailJob(data.job || { ...detailJob, ...formData });
          }
          fetchJobs(statusFilter, searchQuery);
        } else {
          showSnackbar(data.error || 'Failed to update job posting', 'error');
        }
      } else {
        // POST new job
        const res = await fetch('/api/admin/job-postings', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          showSnackbar('New job posting created successfully');
          setFormOpen(false);
          fetchJobs(statusFilter, searchQuery);
        } else {
          showSnackbar(data.error || 'Failed to create job posting', 'error');
        }
      }
    } catch {
      showSnackbar('Network error while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Job Postings CMS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage placement openings and review employer leads. Approved jobs are displayed live on the Placements page.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {canEdit && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconPlus size={18} />}
              onClick={handleOpenCreate}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600, px: 2.5 }}
            >
              Add Job Posting
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<IconRefresh size={16} />}
            onClick={() => fetchJobs(statusFilter, searchQuery)}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filters & Search Toolbar */}
      <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <ToggleButtonGroup
            exclusive
            value={statusFilter}
            onChange={handleFilterChange}
            size="small"
            sx={{ flexWrap: 'wrap' }}
          >
            {[
              { value: 'all', label: `All (${(counts.pending || 0) + (counts.approved || 0) + (counts.rejected || 0)})` },
              { value: 'approved', label: `Approved / Live (${counts.approved || 0})` },
              { value: 'pending', label: `Pending (${counts.pending || 0})` },
              { value: 'rejected', label: `Rejected (${counts.rejected || 0})` },
            ].map((opt) => (
              <ToggleButton key={opt.value} value={opt.value} sx={{ textTransform: 'none', borderRadius: '8px !important', mx: 0.5 }}>
                {opt.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', gap: 1, minWidth: { xs: '100%', sm: 300 } }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size={18} opacity={0.6} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ bgcolor: 'white' }}
            />
            <Button type="submit" variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: 1.5, px: 2 }}>
              Search
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Jobs Table */}
      <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 700 }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Contact Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(8)].map((__, j) => (
                        <TableCell key={j}><Skeleton height={24} /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : jobs.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <IconBriefcase size={36} stroke={1.2} style={{ opacity: 0.3, marginBottom: 8 }} />
                        <Typography color="text.secondary" sx={{ fontWeight: 500 }}>No job postings found.</Typography>
                        {canEdit && (
                          <Button
                            variant="text"
                            startIcon={<IconPlus size={16} />}
                            onClick={handleOpenCreate}
                            sx={{ mt: 1, textTransform: 'none' }}
                          >
                            Add first job posting
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                  : jobs.map((job) => (
                    <TableRow key={job.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {job.jobTitle}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {job.companyLogo ? (
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1.5,
                                border: '1px solid #e2e8f0',
                                bgcolor: 'white',
                                p: 0.3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                shrink: 0,
                                overflow: 'hidden',
                              }}
                            >
                              <img
                                src={job.companyLogo}
                                alt={job.companyName}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                              />
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1.5,
                                bgcolor: 'primary.light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                shrink: 0,
                                opacity: 0.9,
                              }}
                            >
                              <IconBriefcase size={16} style={{ color: '#1A4FD6' }} />
                            </Box>
                          )}
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {job.companyName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{job.location || 'Kerala'}</TableCell>
                      <TableCell>{job.phone}</TableCell>
                      <TableCell>
                        <Chip
                          label={job.status === 'approved' ? 'Live' : job.status}
                          size="small"
                          color={STATUS_COLORS[job.status] || 'default'}
                          sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.source === 'admin' ? 'CMS' : 'Website'}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.72rem', textTransform: 'uppercase' }}
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'text.secondary' }}>
                        {formatDate(job.createdAt)}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        {/* Edit Button */}
                        {canEdit && (
                          <Tooltip title="Edit Job Details">
                            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(job)}>
                              <IconEdit size={17} />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* View Button */}
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => openDetail(job)}>
                            <IconEye size={17} />
                          </IconButton>
                        </Tooltip>

                        {/* Quick Approve / Reject */}
                        {canEdit && job.status !== 'approved' && (
                          <Tooltip title="Approve & Publish to Placements">
                            <IconButton
                              size="small"
                              color="success"
                              disabled={actionLoading === job.id + 'approved'}
                              onClick={() => updateStatus(job.id, 'approved')}
                            >
                              {actionLoading === job.id + 'approved' ? <CircularProgress size={16} /> : <IconCheck size={17} />}
                            </IconButton>
                          </Tooltip>
                        )}

                        {canEdit && job.status === 'approved' && (
                          <Tooltip title="Unpublish / Reject">
                            <IconButton
                              size="small"
                              color="warning"
                              disabled={actionLoading === job.id + 'rejected'}
                              onClick={() => updateStatus(job.id, 'rejected')}
                            >
                              {actionLoading === job.id + 'rejected' ? <CircularProgress size={16} /> : <IconX size={17} />}
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Delete Button */}
                        {canDelete && (
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => setDeleteTarget(job)}>
                              <IconTrash size={17} />
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

      {/* CMS Create / Edit Job Dialog */}
      <Dialog open={formOpen} onClose={() => !saving && setFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingJob ? 'Edit Job Posting' : 'Add New Job Posting'}
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400, mt: 0.5 }}>
            {editingJob
              ? 'Update job information, logo, requirements, or publication status.'
              : 'Create a new placement vacancy. Set status to "Approved" to publish directly on the Placements page.'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            {/* Job Title */}
            <Box>
              <TextField
                fullWidth
                label="Job Title *"
                placeholder="e.g. SEO Specialist, Digital Marketing Executive"
                value={formData.jobTitle}
                onChange={(e) => setFormData((p) => ({ ...p, jobTitle: e.target.value }))}
                error={Boolean(formErrors.jobTitle)}
                helperText={formErrors.jobTitle}
              />
            </Box>

            {/* Company Name */}
            <Box>
              <TextField
                fullWidth
                label="Company Name *"
                placeholder="e.g. Tech Solutions Kerala"
                value={formData.companyName}
                onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                error={Boolean(formErrors.companyName)}
                helperText={formErrors.companyName}
              />
            </Box>

            {/* Company Logo Section (CMS Upload / Picker) */}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Company Logo (Optional)
              </Typography>
              {formData.companyLogo ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    border: '1px solid #e5eaef',
                    borderRadius: 2.5,
                    bgcolor: '#FAFBFD',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      border: '1px solid #cbd5e1',
                      bgcolor: 'white',
                      p: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      shrink: 0,
                    }}
                  >
                    <img
                      src={formData.companyLogo}
                      alt="Company Logo Preview"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Logo selected
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {formData.companyLogo}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setMediaPickerOpen(true)}
                      sx={{ textTransform: 'none', borderRadius: 1.5 }}
                    >
                      Change
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setFormData((p) => ({ ...p, companyLogo: '' }))}
                      sx={{ textTransform: 'none', borderRadius: 1.5 }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: 2.5,
                    p: 2.5,
                    textAlign: 'center',
                    bgcolor: '#F8FAFC',
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  <IconPhoto size={30} stroke={1.3} style={{ opacity: 0.5, marginBottom: 4 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                    Upload or Choose Company Logo
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, maxWidth: 450, mx: 'auto' }}>
                    Recommended format: Square or landscape transparent PNG/SVG or WEBP. If left empty, the placement grid displays a default briefcase icon.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<IconFolder size={15} />}
                      onClick={() => setMediaPickerOpen(true)}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      Choose from Media Library
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={uploadingLogo ? <CircularProgress size={14} /> : <IconCloudUpload size={15} />}
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      {uploadingLogo ? 'Uploading...' : 'Upload from Device'}
                    </Button>
                  </Box>
                </Box>
              )}
              {/* Hidden file input */}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleLogoFileUpload}
              />
            </Box>

            {/* Phone */}
            <Box>
              <TextField
                fullWidth
                label="Contact Phone / WhatsApp *"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                error={Boolean(formErrors.phone)}
                helperText={formErrors.phone}
              />
            </Box>

            {/* Location */}
            <Box>
              <TextField
                fullWidth
                label="Location"
                placeholder="e.g. Kochi, Kerala / Remote / Hybrid"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
              />
            </Box>

            {/* Job Types */}
            <Box>
              <TextField
                fullWidth
                label="Job Type"
                placeholder="e.g. Full-time, Internship, Part-time"
                value={formData.jobTypes}
                onChange={(e) => setFormData((p) => ({ ...p, jobTypes: e.target.value }))}
              />
            </Box>

            {/* Shift & Schedule */}
            <Box>
              <TextField
                fullWidth
                label="Shift & Schedule"
                placeholder="e.g. Day Shift, Regular Hours"
                value={formData.shiftSchedule}
                onChange={(e) => setFormData((p) => ({ ...p, shiftSchedule: e.target.value }))}
              />
            </Box>

            {/* Status */}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <FormControl fullWidth>
                <InputLabel id="job-status-label">Publication Status</InputLabel>
                <Select
                  labelId="job-status-label"
                  label="Publication Status"
                  value={formData.status}
                  onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                >
                  <MenuItem value="approved">Approved — Live on Placements page</MenuItem>
                  <MenuItem value="pending">Pending — Review required</MenuItem>
                  <MenuItem value="rejected">Rejected — Not visible to public</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* About Company / Job Overview */}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Job Description / About Company"
                placeholder="Overview of the company and role responsibilities..."
                value={formData.aboutCompany}
                onChange={(e) => setFormData((p) => ({ ...p, aboutCompany: e.target.value }))}
                helperText="This description is prominently shown on the Placements job card."
              />
            </Box>

            {/* Skills Required */}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Skills Required"
                placeholder="e.g. Google Ads, Meta Ads, SEO, Content Writing, Google Analytics"
                value={formData.skillsRequired}
                onChange={(e) => setFormData((p) => ({ ...p, skillsRequired: e.target.value }))}
              />
            </Box>

            {/* Eligibility & Experience */}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Eligibility / Qualifications"
                placeholder="e.g. Graduate or Zeon Academy Alumni, 0-1 year experience"
                value={formData.eligibility}
                onChange={(e) => setFormData((p) => ({ ...p, eligibility: e.target.value }))}
              />
            </Box>

            {/* Admin Notes */}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Internal Admin Notes (Private)"
                placeholder="Internal interview feedback, contact person notes, etc."
                value={formData.adminNotes}
                onChange={(e) => setFormData((p) => ({ ...p, adminNotes: e.target.value }))}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setFormOpen(false)} disabled={saving} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveForm}
            disabled={saving}
            sx={{ textTransform: 'none', minWidth: 120, borderRadius: 2 }}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : editingJob ? 'Save Changes' : 'Create Job'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedUrl={formData.companyLogo || ''}
        title="Select Company Logo"
        onSelect={(url) => {
          setFormData((prev) => ({ ...prev, companyLogo: url }));
          setMediaPickerOpen(false);
          showSnackbar('Company logo selected');
        }}
      />

      {/* View Details Dialog */}
      <Dialog open={Boolean(detailJob)} onClose={() => setDetailJob(null)} maxWidth="sm" fullWidth>
        {detailJob && (
          <>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {detailJob.companyLogo ? (
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      border: '1px solid #cbd5e1',
                      bgcolor: 'white',
                      p: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      shrink: 0,
                    }}
                  >
                    <img
                      src={detailJob.companyLogo}
                      alt={detailJob.companyName}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shrink: 0,
                    }}
                  >
                    <IconBriefcase size={22} style={{ color: '#1A4FD6' }} />
                  </Box>
                )}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {detailJob.jobTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {detailJob.companyName}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={detailJob.status === 'approved' ? 'Live on Site' : detailJob.status}
                size="small"
                color={STATUS_COLORS[detailJob.status] || 'default'}
                sx={{ textTransform: 'capitalize', fontWeight: 600 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                {[
                  ['Company', detailJob.companyName],
                  ['Phone / WhatsApp', detailJob.phone],
                  ['Location', detailJob.location || 'Kerala'],
                  ['Job Types', detailJob.jobTypes],
                  ['Shift & Schedule', detailJob.shiftSchedule],
                  ['About Company / Job Description', detailJob.aboutCompany],
                  ['Skills Required', detailJob.skillsRequired],
                  ['Eligibility', detailJob.eligibility],
                  ['Status', detailJob.status],
                  ['Submitted / Created', formatDate(detailJob.createdAt)],
                  ['Source', detailJob.source === 'admin' ? 'CMS (Admin Created)' : 'Website Form'],
                ].map(([label, value]) => (
                  value ? (
                    <Box key={label}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                        {label}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 0.25 }}>
                        {value}
                      </Typography>
                    </Box>
                  ) : null
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Admin Internal Notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                disabled={!canEdit}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
              {canEdit && (
                <Button
                  variant="outlined"
                  startIcon={<IconEdit size={16} />}
                  onClick={() => {
                    const j = detailJob;
                    setDetailJob(null);
                    handleOpenEdit(j);
                  }}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Edit Job
                </Button>
              )}
              {detailJob.status !== 'approved' && canEdit && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<IconCheck size={16} />}
                  onClick={() => updateStatus(detailJob.id, 'approved')}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Approve & Publish
                </Button>
              )}
              {detailJob.status === 'approved' && canEdit && (
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<IconX size={16} />}
                  onClick={() => updateStatus(detailJob.id, 'rejected')}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Unpublish
                </Button>
              )}
              {canEdit && (
                <Button onClick={saveNotes} disabled={actionLoading === 'notes'} sx={{ textTransform: 'none', borderRadius: 2 }}>
                  Save Notes
                </Button>
              )}
              <Button onClick={() => setDetailJob(null)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete job posting?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete <strong>{deleteTarget?.jobTitle}</strong> at {deleteTarget?.companyName}? This action cannot be undone and will remove it from the Placements page if active.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting} sx={{ textTransform: 'none', borderRadius: 2 }}>
            {deleting ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
