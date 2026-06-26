'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Checkbox, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Snackbar, Alert,
  CircularProgress, Tooltip, Grid, Divider,
} from '@mui/material';
import {
  IconPlus, IconPencil, IconTrash, IconShield, IconUsers,
} from '@tabler/icons-react';

// ── Permission matrix definition ────────────────────────────────────────────
const PERMISSION_MATRIX = [
  {
    label: 'Dashboard',
    cols: { view: 'dashboard.view', create: null, edit: null, delete: null, publish: null, manage: null },
  },
  {
    label: 'Blogs',
    cols: { view: 'blogs.view', create: 'blogs.create', edit: 'blogs.edit', delete: 'blogs.delete', publish: 'blogs.publish', manage: null },
  },
  {
    label: 'Media Library',
    cols: { view: 'media.view', create: null, edit: null, delete: null, publish: null, manage: 'media.upload' },
  },
  {
    label: 'Settings',
    cols: { view: 'settings.view', create: null, edit: 'settings.edit', delete: null, publish: null, manage: null },
  },
  {
    label: 'Users',
    cols: { view: 'users.view', create: 'users.create', edit: 'users.edit', delete: 'users.delete', publish: null, manage: null },
  },
  {
    label: 'Groups',
    cols: { view: null, create: null, edit: null, delete: null, publish: null, manage: 'groups.manage' },
  },
  {
    label: 'Analytics',
    cols: { view: 'analytics.view', create: null, edit: null, delete: null, publish: null, manage: null },
  },
  {
    label: 'SEO / Sitemap',
    cols: { view: null, create: null, edit: null, delete: null, publish: null, manage: 'seo.manage' },
  },
  {
    label: 'Chatbot Leads',
    cols: { view: 'chatbot-leads.view', create: null, edit: 'chatbot-leads.edit', delete: 'chatbot-leads.delete', publish: null, manage: null },
  },
  {
    label: 'Chat Analytics',
    cols: { view: 'chat-analytics.view', create: null, edit: null, delete: null, publish: null, manage: null },
  },
  {
    label: 'Contact Leads',
    cols: { view: 'contact-leads.view', create: null, edit: 'contact-leads.edit', delete: 'contact-leads.delete', publish: null, manage: null },
  },
];

const COL_LABELS = ['View', 'Create', 'Edit', 'Delete', 'Publish', 'Manage/Upload'];
const COL_KEYS = ['view', 'create', 'edit', 'delete', 'publish', 'manage'];

const ALL_VALID_PERMISSIONS = PERMISSION_MATRIX.flatMap((row) =>
  Object.values(row.cols).filter(Boolean)
);

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('zeon_admin_token') : '';
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

// ── Permission Checkbox Grid ─────────────────────────────────────────────────
function PermissionGrid({ permissions, onChange }) {
  const isChecked = (key) => key && permissions.includes(key);

  const toggle = (key) => {
    if (!key) return;
    onChange(
      permissions.includes(key) ? permissions.filter((p) => p !== key) : [...permissions, key]
    );
  };

  const toggleRow = (row) => {
    const rowKeys = Object.values(row.cols).filter(Boolean);
    const allChecked = rowKeys.every((k) => permissions.includes(k));
    if (allChecked) {
      onChange(permissions.filter((p) => !rowKeys.includes(p)));
    } else {
      const merged = [...new Set([...permissions, ...rowKeys])];
      onChange(merged);
    }
  };

  const toggleAll = () => {
    if (permissions.length === ALL_VALID_PERMISSIONS.length) {
      onChange([]);
    } else {
      onChange([...ALL_VALID_PERMISSIONS]);
    }
  };

  const allChecked = permissions.length === ALL_VALID_PERMISSIONS.length;

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
            <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={allChecked}
                  indeterminate={permissions.length > 0 && !allChecked}
                  onChange={toggleAll}
                  size="small"
                />
                Resource
              </Box>
            </TableCell>
            {COL_LABELS.map((label) => (
              <TableCell key={label} align="center" sx={{ fontWeight: 600, fontSize: '0.78rem', color: 'text.secondary' }}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {PERMISSION_MATRIX.map((row) => {
            const rowKeys = Object.values(row.cols).filter(Boolean);
            const rowAllChecked = rowKeys.length > 0 && rowKeys.every((k) => permissions.includes(k));
            const rowSomeChecked = rowKeys.some((k) => permissions.includes(k));
            return (
              <TableRow key={row.label} hover sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox
                      checked={rowAllChecked}
                      indeterminate={rowSomeChecked && !rowAllChecked}
                      onChange={() => toggleRow(row)}
                      size="small"
                      disabled={rowKeys.length === 0}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.label}
                    </Typography>
                  </Box>
                </TableCell>
                {COL_KEYS.map((col) => {
                  const key = row.cols[col];
                  return (
                    <TableCell key={col} align="center">
                      {key ? (
                        <Tooltip title={key} arrow placement="top">
                          <Checkbox
                            checked={isChecked(key)}
                            onChange={() => toggle(key)}
                            size="small"
                            sx={{ color: '#1A4FD6' }}
                          />
                        </Tooltip>
                      ) : (
                        <Box sx={{ width: 24, height: 24, display: 'inline-block' }} />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPermissions, setFormPermissions] = useState([]);
  const [formError, setFormError] = useState('');

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/groups', { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setGroups(data.groups || []);
      else showSnackbar(data.error || 'Failed to load groups', 'error');
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const openCreate = () => {
    setEditingGroup(null);
    setFormName('');
    setFormDescription('');
    setFormPermissions([]);
    setFormError('');
    setDialogOpen(true);
  };

  const openEdit = (group) => {
    setEditingGroup(group);
    setFormName(group.name);
    setFormDescription(group.description || '');
    setFormPermissions(Array.isArray(group.permissions) ? group.permissions : []);
    setFormError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setFormError('Group name is required');
      return;
    }
    setSaving(true);
    setFormError('');

    const url = editingGroup
      ? `/api/admin/groups/${editingGroup.id}`
      : '/api/admin/groups';
    const method = editingGroup ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify({ name: formName, description: formDescription, permissions: formPermissions }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to save group');
        return;
      }
      setDialogOpen(false);
      showSnackbar(editingGroup ? 'Group updated successfully' : 'Group created successfully');
      fetchGroups();
    } catch {
      setFormError('Network error — please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/groups/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        showSnackbar(data.error || 'Failed to delete group', 'error');
        return;
      }
      setDeleteTarget(null);
      showSnackbar('Group deleted');
      fetchGroups();
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Groups & Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create groups and define exactly what each group can access using the permission grid.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<IconPlus size={18} />}
          onClick={openCreate}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
        >
          Create Group
        </Button>
      </Box>

      {/* Group Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : groups.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8, textAlign: 'center', border: '2px dashed #e5eaef', borderRadius: 3,
          }}
        >
          <IconShield size={48} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            No groups yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first group to start assigning permissions to users.
          </Typography>
          <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={openCreate} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Create Group
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {groups.map((group) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={group.id}>
              <Paper
                elevation={1}
                sx={{
                  p: 3, borderRadius: 3, border: '1px solid #e5eaef', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderColor: '#1A4FD6' },
                  transition: 'all 0.2s',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1.5, backgroundColor: '#EFF6FF' }}>
                      <IconShield size={20} style={{ color: '#1A4FD6' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {group.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                        <IconUsers size={13} style={{ color: '#94A3B8' }} />
                        <Typography variant="caption" color="text.secondary">
                          {group.userCount} user{group.userCount !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => openEdit(group)}>
                      <IconPencil size={16} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(group)}>
                      <IconTrash size={16} />
                    </IconButton>
                  </Box>
                </Box>

                {group.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.82rem' }}>
                    {group.description}
                  </Typography>
                )}

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 1 }}>
                  {(Array.isArray(group.permissions) ? group.permissions : []).slice(0, 6).map((p) => (
                    <Chip
                      key={p}
                      label={p}
                      size="small"
                      sx={{ fontSize: '0.68rem', height: 20, backgroundColor: '#EFF6FF', color: '#1A4FD6' }}
                    />
                  ))}
                  {group.permissions.length > 6 && (
                    <Chip
                      label={`+${group.permissions.length - 6} more`}
                      size="small"
                      sx={{ fontSize: '0.68rem', height: 20, backgroundColor: '#F1F5F9', color: '#64748B' }}
                    />
                  )}
                  {group.permissions.length === 0 && (
                    <Typography variant="caption" color="text.disabled">
                      No permissions assigned
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Typography variant="caption" color="text.disabled">
                    {group.permissions.length} / {ALL_VALID_PERMISSIONS.length} permissions enabled
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingGroup ? `Edit Group: ${editingGroup.name}` : 'Create New Group'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              fullWidth
              label="Group Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              placeholder="e.g. SEO Team, Content Writers, Managers"
              error={!!formError && !formName.trim()}
            />
            <TextField
              fullWidth
              label="Description (optional)"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Brief description of this group's role"
              multiline
              rows={2}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Permissions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Select which actions this group can perform. Hover over a checkbox to see the exact permission key.
              </Typography>
              <PermissionGrid permissions={formPermissions} onChange={setFormPermissions} />
            </Box>

            {formError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>{formError}</Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={saving} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : (editingGroup ? 'Save Changes' : 'Create Group')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Group</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
          </Typography>
          {deleteTarget?.userCount > 0 && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              This group has {deleteTarget.userCount} user(s) assigned. Reassign or remove them before deleting.
            </Alert>
          )}
          {deleteTarget?.userCount === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting || deleteTarget?.userCount > 0}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete Group'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
