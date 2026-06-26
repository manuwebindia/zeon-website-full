'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Chip, CircularProgress,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Alert, Skeleton, Grid,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { IconChartBar, IconMessageCircle, IconUsers, IconTrendingUp, IconStar } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

// ── Helpers ──────────────────────────────────────────────────────────────────
function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('wdk_admin_token') : '';
}
function can(key) {
  try {
    const perms = JSON.parse(localStorage.getItem('wdk_admin_permissions') || '[]');
    return perms.includes('*') || perms.includes(key);
  } catch { return false; }
}
function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

// ── Metric Card ───────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, label, value, color = '#1A4FD6', loading }) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid #e5eaef',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.2s',
        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderColor: color },
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={24} style={{ color }} />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.5px' }}>
          {label}
        </Typography>
        {loading ? (
          <Skeleton width={60} height={28} />
        ) : (
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2, mt: 0.3 }}>
            {value}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

// ── Custom Bar Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={3} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e5eaef' }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: '#1A4FD6', fontWeight: 600 }}>
        {payload[0].value} session{payload[0].value !== 1 ? 's' : ''}
      </Typography>
    </Paper>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChatAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Permission guard
  useEffect(() => {
    if (!can('chat-analytics.view')) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  // ── Fetch Analytics ──────────────────────────────────────────────────────
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/chat-analytics', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        setError(json.error || 'Failed to load analytics');
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const maxBarValue = data
    ? Math.max(...data.sessionsPerDay.map((d) => d.count), 1)
    : 1;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Chat Analytics
            </Typography>
            <Chip label="Last 30 days" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', backgroundColor: '#EFF6FF', color: '#1A4FD6' }} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Honey chatbot session insights and visitor engagement metrics.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
      )}

      {/* Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={IconUsers}
            label="Total Sessions"
            value={data ? data.totalSessions.toLocaleString() : '—'}
            color="#1A4FD6"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={IconMessageCircle}
            label="Total Messages"
            value={data ? data.totalMessages.toLocaleString() : '—'}
            color="#17C653"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={IconTrendingUp}
            label="Avg Msgs / Session"
            value={data ? data.avgMessagesPerSession : '—'}
            color="#F59E0B"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={IconChartBar}
            label="Active Today"
            value={data ? data.activeToday.toLocaleString() : '—'}
            color="#8B5CF6"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Sessions Per Day Chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaef' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              Sessions per Day
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '0.8rem' }}>
              Last 14 days
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data?.sessionsPerDay || []} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateLabel}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    domain={[0, maxBarValue + 1]}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#EFF6FF' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {(data?.sessionsPerDay || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.count > 0 ? '#1A4FD6' : '#E2E8F0'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Top Questions */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaef', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <IconStar size={18} style={{ color: '#F59E0B' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Top Questions
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem' }}>
              Most common first questions asked
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height={36} sx={{ borderRadius: 1 }} />)}
              </Box>
            ) : !data?.topQuestions?.length ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                  Not enough data yet.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', width: 32, pl: 0 }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary' }}>Question</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', pr: 0 }}>Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.topQuestions.map((q, i) => (
                      <TableRow key={i} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={{ color: 'text.disabled', fontWeight: 600, fontSize: '0.75rem', pl: 0 }}>
                          {i + 1}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                          {q.question}
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 0 }}>
                          <Chip
                            label={q.count}
                            size="small"
                            sx={{
                              fontSize: '0.68rem',
                              height: 20,
                              fontWeight: 700,
                              backgroundColor: '#EFF6FF',
                              color: '#1A4FD6',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
