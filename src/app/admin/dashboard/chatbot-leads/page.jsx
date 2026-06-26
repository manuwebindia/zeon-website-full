'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Snackbar, Alert, CircularProgress,
  Tooltip, Select, MenuItem as MuiMenuItem, FormControl,
  ToggleButton, ToggleButtonGroup, Skeleton, Divider,
} from '@mui/material';
import {
  IconTrash, IconEye, IconDownload, IconMessage,
  IconRefresh,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

// ── Helpers ──────────────────────────────────────────────────────────────────
function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('wdk_admin_token') : '';
}
function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}
function can(key) {
  try {
    const perms = JSON.parse(localStorage.getItem('wdk_admin_permissions') || '[]');
    return perms.includes('*') || perms.includes(key);
  } catch { return false; }
}
function formatDate(d) {
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'closed'];
const STATUS_COLORS = {
  new: 'primary', contacted: 'warning', converted: 'success', closed: 'default',
};

// ── Mini Transcript Renderer ──────────────────────────────────────────────────
function TranscriptView({ transcript }) {
  if (!Array.isArray(transcript) || transcript.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No conversation recorded.
      </Typography>
    );
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
      {transcript.map((msg, i) => {
        const isUser = msg.role === 'user';
        return (
          <Box
            key={i}
            sx={{
              alignSelf: isUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              px: 2, py: 1.5,
              borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              backgroundColor: isUser ? '#EFF6FF' : '#F8FAFC',
              border: '1px solid',
              borderColor: isUser ? '#BFDBFE' : '#E2E8F0',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: isUser ? '#1A4FD6' : '#64748B', display: 'block', mb: 0.5 }}>
              {isUser ? 'Visitor' : 'Honey'}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>
              {msg.content}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChatbotLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [counts, setCounts] = useState({ new: 0, contacted: 0, converted: 0, closed: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailLead, setDetailLead] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Permission guard
  useEffect(() => {
    if (!can('chatbot-leads.view')) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  // ── Fetch Leads ──────────────────────────────────────────────────────────
  const fetchLeads = useCallback(async (filter = statusFilter) => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await fetch(`/api/admin/chatbot-leads${params}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads || []);
        setTotal(data.total || 0);
        setCounts(data.counts || {});
      } else {
        showSnackbar(data.error || 'Failed to load leads', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // ── Status Filter ────────────────────────────────────────────────────────
  const handleFilterChange = (_, newFilter) => {
    if (newFilter === null) return;
    setStatusFilter(newFilter);
    fetchLeads(newFilter);
  };

  // ── Inline Status Update ─────────────────────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    if (!can('chatbot-leads.edit')) return;
    try {
      const res = await fetch(`/api/admin/chatbot-leads/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        setCounts((prev) => {
          const lead = leads.find((l) => l.id === id);
          if (!lead) return prev;
          const updated = { ...prev };
          updated[lead.status] = Math.max(0, (updated[lead.status] ?? 0) - 1);
          updated[newStatus] = (updated[newStatus] ?? 0) + 1;
          return updated;
        });
        showSnackbar('Status updated');
      } else {
        const d = await res.json();
        showSnackbar(d.error || 'Failed to update', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    }
  };

  // ── View Detail ──────────────────────────────────────────────────────────
  const openDetail = async (lead) => {
    setDetailLead({ ...lead, transcript: null });
    setEditNotes(lead.notes || '');
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/chatbot-leads/${lead.id}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setDetailLead(data.lead);
        setEditNotes(data.lead.notes || '');
      }
    } catch {
      // Keep basic lead data, just no transcript
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Save Notes ───────────────────────────────────────────────────────────
  const handleSaveNotes = async () => {
    if (!detailLead || !can('chatbot-leads.edit')) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/chatbot-leads/${detailLead.id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ notes: editNotes }),
      });
      if (res.ok) {
        setDetailLead((prev) => ({ ...prev, notes: editNotes }));
        setLeads((prev) =>
          prev.map((l) => (l.id === detailLead.id ? { ...l, notes: editNotes } : l))
        );
        showSnackbar('Notes saved');
      } else {
        showSnackbar('Failed to save notes', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/chatbot-leads/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        setDeleteTarget(null);
        showSnackbar('Lead deleted');
        fetchLeads();
      } else {
        const d = await res.json();
        showSnackbar(d.error || 'Failed to delete', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ── CSV Export ───────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      const params = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
      const res = await fetch(`/api/admin/chatbot-leads?format=csv${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatbot-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      showSnackbar('Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Chatbot Leads
            </Typography>
            <Chip label={`${total} total`} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Visitors who shared their contact details via Honey chatbot.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<IconRefresh size={16} />}
            onClick={() => fetchLeads()}
            disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={exporting ? <CircularProgress size={14} /> : <IconDownload size={16} />}
            onClick={handleExport}
            disabled={exporting || leads.length === 0}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Status Filter + Counts */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={handleFilterChange}
          size="small"
          sx={{ flexWrap: 'wrap', gap: 0.5 }}
        >
          <ToggleButton value="all" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px !important' }}>
            All ({Object.values(counts).reduce((a, b) => a + b, 0)})
          </ToggleButton>
          {STATUS_OPTIONS.map((s) => (
            <ToggleButton
              key={s}
              value={s}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px !important', textTransform: 'capitalize' }}
            >
              {s} ({counts[s] ?? 0})
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Table */}
      {loading ? (
        <Box>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={60} sx={{ mb: 0.5, borderRadius: 1 }} />
          ))}
        </Box>
      ) : leads.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ p: 8, textAlign: 'center', border: '2px dashed #e5eaef', borderRadius: 3 }}
        >
          <IconMessage size={48} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            No leads yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chatbot leads will appear here once visitors share their details.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3, border: '1px solid #e5eaef' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Page URL</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', minWidth: 140 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{lead.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      +91 {lead.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={lead.source} size="small" sx={{ fontSize: '0.68rem', height: 20 }} />
                  </TableCell>
                  <TableCell>
                    {lead.pageUrl ? (
                      <Tooltip title={lead.pageUrl} arrow placement="top">
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 140,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '0.78rem',
                            color: 'text.secondary',
                          }}
                        >
                          {lead.pageUrl}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.78rem' }}>—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {can('chatbot-leads.edit') ? (
                      <FormControl size="small" fullWidth>
                        <Select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          sx={{ fontSize: '0.78rem', borderRadius: 1.5 }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <MuiMenuItem key={s} value={s} sx={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>
                              {s}
                            </MuiMenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip
                        label={lead.status}
                        size="small"
                        color={STATUS_COLORS[lead.status] || 'default'}
                        sx={{ textTransform: 'capitalize', fontSize: '0.68rem', height: 22 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.78rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {formatDate(lead.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton size="small" onClick={() => openDetail(lead)} title="View details">
                        <IconEye size={16} />
                      </IconButton>
                      {can('chatbot-leads.delete') && (
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(lead)} title="Delete lead">
                          <IconTrash size={16} />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!detailLead}
        onClose={() => setDetailLead(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {detailLead && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              Lead Details — {detailLead.name}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Info Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  {[
                    { label: 'Name', value: detailLead.name },
                    { label: 'Phone', value: `+91 ${detailLead.phone}` },
                    { label: 'Source', value: detailLead.source },
                    { label: 'Status', value: detailLead.status },
                    { label: 'Date', value: formatDate(detailLead.createdAt) },
                    { label: 'Page URL', value: detailLead.pageUrl || '—' },
                  ].map(({ label, value }) => (
                    <Box key={label}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                        {label}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.3, wordBreak: 'break-all' }}>{value}</Typography>
                    </Box>
                  ))}
                </Box>

                <Divider />

                {/* Notes */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Internal Notes</Typography>
                  {can('chatbot-leads.edit') ? (
                    <>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add internal notes about this lead..."
                        size="small"
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
                      >
                        {savingNotes ? <CircularProgress size={14} color="inherit" /> : 'Save Notes'}
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {detailLead.notes || 'No notes.'}
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Transcript */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Conversation Transcript
                  </Typography>
                  {detailLoading ? (
                    <Skeleton height={80} />
                  ) : (
                    <TranscriptView transcript={detailLead.transcript} />
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setDetailLead(null)} sx={{ textTransform: 'none' }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Lead</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the lead for <strong>{deleteTarget?.name}</strong> ({deleteTarget?.phone})?
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
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete Lead'}
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
