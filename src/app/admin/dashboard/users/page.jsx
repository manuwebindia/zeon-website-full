'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Chip, Avatar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem as MuiMenuItem, FormControl,
  InputLabel, Switch, FormControlLabel, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Snackbar, Alert, CircularProgress, Tooltip, InputAdornment,
} from '@mui/material';
import {
  IconPlus, IconPencil, IconTrash, IconUsers, IconEye, IconEyeOff,
} from '@tabler/icons-react';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('wdk_admin_token') : '';
}
function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}
function formatRelativeTime(date) {
  if (!date) return 'Never';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function UserFormDialog({ open, onClose, onSave, editingUser, groups }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [groupId, setGroupId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (editingUser) {
        setUsername(editingUser.username || '');
        setEmail(editingUser.email || '');
        setDisplayName(editingUser.displayName || '');
        setPassword('');
        setAvatarUrl(editingUser.avatarUrl || '');
        setGroupId(editingUser.groupId || '');
        setIsActive(editingUser.isActive !== false);
      } else {
        setUsername(''); setEmail(''); setDisplayName(''); setPassword('');
        setAvatarUrl(''); setGroupId(''); setIsActive(true);
      }
      setError('');
    }
  }, [open, editingUser]);

  const handleSubmit = async () => {
    if (!username.trim()) { setError('Username is required'); return; }
    if (!editingUser && (!password || password.length < 8)) {
      setError('Password must be at least 8 characters'); return;
    }
    if (editingUser && password && password.length < 8) {
      setError('Password must be at least 8 characters'); return;
    }
    if (!groupId) { setError('Please select a group'); return; }
    setSaving(true);
    setError('');

    const body = { username, email, displayName, avatarUrl, groupId, isActive };
    if (!editingUser) body.password = password;
    else if (password) body.password = password;

    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      onSave();
      onClose();
    } catch {
      setError('Network error — please try again');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {editingUser ? `Edit User: ${editingUser.username}` : 'Create New User'}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            fullWidth label="Username" value={username}
            onChange={(e) => setUsername(e.target.value)}
            required disabled={!!editingUser}
            helperText={editingUser ? 'Username cannot be changed' : '3–30 chars, alphanumeric + underscores'}
          />
          <TextField
            fullWidth label="Display Name" value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. John Smith"
          />
          <TextField
            fullWidth label="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!editingUser}
            helperText="Minimum 8 characters"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth required>
            <InputLabel>Group</InputLabel>
            <Select value={groupId} label="Group" onChange={(e) => setGroupId(e.target.value)}>
              {groups.map((g) => (
                <MuiMenuItem key={g.id} value={g.id}>{g.name}</MuiMenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth label="Avatar URL (optional)" value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
          {editingUser && (
            <FormControlLabel
              control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} color="primary" />}
              label={isActive ? 'Active' : 'Inactive'}
            />
          )}
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={saving} sx={{ textTransform: 'none' }}>Cancel</Button>
        <Button
          variant="contained" onClick={handleSubmit} disabled={saving}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : (editingUser ? 'Save Changes' : 'Create User')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, groupsRes] = await Promise.all([
        fetch('/api/admin/users', { headers: authHeaders() }),
        fetch('/api/admin/groups', { headers: authHeaders() }),
      ]);
      const [usersData, groupsData] = await Promise.all([usersRes.json(), groupsRes.json()]);
      if (usersRes.ok) setUsers(usersData.users || []);
      if (groupsRes.ok) setGroups(groupsData.groups || []);
    } catch {
      showSnackbar('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) { showSnackbar(data.error || 'Failed to delete', 'error'); return; }
      setDeleteTarget(null);
      showSnackbar('User deleted');
      fetchData();
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
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage admin panel users, assign groups, and control account access.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<IconPlus size={18} />}
          onClick={() => { setEditingUser(null); setDialogOpen(true); }}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
        >
          Create User
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : users.length === 0 ? (
        <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: '2px dashed #e5eaef', borderRadius: 3 }}>
          <IconUsers size={48} style={{ color: '#CBD5E1', marginBottom: 12 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>No users yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first user and assign them a group.
          </Typography>
          <Button variant="contained" startIcon={<IconPlus size={16} />}
            onClick={() => { setEditingUser(null); setDialogOpen(true); }}
            sx={{ textTransform: 'none', fontWeight: 600 }}>
            Create User
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3, border: '1px solid #e5eaef' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Group</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Last Login</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={u.avatarUrl || undefined}
                        sx={{ width: 36, height: 36, fontSize: '0.78rem', fontWeight: 700, bgcolor: '#1A4FD6' }}
                      >
                        {getInitials(u.displayName || u.username)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                          {u.displayName || u.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{u.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{u.email || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.group?.name || 'Unknown'}
                      size="small"
                      sx={{ backgroundColor: '#EFF6FF', color: '#1A4FD6', fontWeight: 600, fontSize: '0.73rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        backgroundColor: u.isActive ? '#F0FFF4' : '#FFF1F0',
                        color: u.isActive ? '#17C653' : '#EF4444',
                        fontWeight: 600,
                        fontSize: '0.73rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatRelativeTime(u.lastLoginAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit user">
                      <IconButton size="small" onClick={() => { setEditingUser(u); setDialogOpen(true); }}>
                        <IconPencil size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete user">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(u)}>
                        <IconTrash size={16} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* User Form Dialog */}
      <UserFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={() => { fetchData(); showSnackbar(editingUser ? 'User updated' : 'User created'); }}
        editingUser={editingUser}
        groups={groups}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete <strong>@{deleteTarget?.username}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained" color="error" onClick={handleDelete} disabled={deleting}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
