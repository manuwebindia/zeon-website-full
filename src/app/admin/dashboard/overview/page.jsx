'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  IconFileText,
  IconTrendingUp,
  IconChartBar,
  IconClock,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';

export default function DashboardOverviewPage() {
  const [blogs, setBlogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('wdk_admin_token');
        const res = await fetch('/api/admin/blogs', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.blogs || []);
        }
      } catch (error) {
        console.error('Failed to fetch blogs in dashboard overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Helper to calculate a highly realistic SEO score based on populated fields
  const calculateSeoScore = (blog) => {
    let score = 20; // Base score
    if (blog.title && blog.title.trim().length > 10) score += 15;
    if (blog.slug) score += 15;
    if (blog.focusKeyword) score += 25; // Focus keyword is high weight
    if (blog.featuredImage) score += 15;
    if (blog.allowIndexing) score += 10;
    return Math.min(score, 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Calculate dynamic values
  const totalPosts = blogs.length;
  
  const totalSeoScore = blogs.reduce((sum, blog) => sum + calculateSeoScore(blog), 0);
  const avgSeoScore = totalPosts > 0 ? Math.round(totalSeoScore / totalPosts) : 0;
  
  const draftsCount = blogs.filter((b) => b.status !== 'published').length;

  // Determine SEO score text range
  let seoRangeText = 'No posts yet';
  let seoRangeColor = 'text.secondary';
  if (totalPosts > 0) {
    if (avgSeoScore >= 85) {
      seoRangeText = 'Excellent range';
      seoRangeColor = 'success.main';
    } else if (avgSeoScore >= 70) {
      seoRangeText = 'Good range';
      seoRangeColor = 'info.main';
    } else {
      seoRangeText = 'Needs work';
      seoRangeColor = 'error.main';
    }
  }

  // Metrics configurations
  const metrics = [
    {
      title: 'Total Posts',
      value: totalPosts.toString(),
      change: 'Live from database',
      changeColor: 'success.main',
      icon: <IconFileText size={24} style={{ color: '#1A4FD6' }} />,
      bgColor: 'rgba(26, 79, 214, 0.08)',
    },
    {
      title: 'Avg. SEO Score',
      value: `${avgSeoScore}%`,
      change: seoRangeText,
      changeColor: seoRangeColor,
      icon: <IconTrendingUp size={24} style={{ color: '#17C653' }} />,
      bgColor: 'rgba(23, 198, 83, 0.08)',
    },
    {
      title: 'Estimated Traffic',
      value: '18,450', // STATIC MOCK (weekly page views / estimated traffic as requested)
      change: '+15.8% vs last week',
      changeColor: 'success.main',
      icon: <IconChartBar size={24} style={{ color: '#ff9800' }} />,
      bgColor: 'rgba(255, 152, 0, 0.08)',
    },
    {
      title: 'Draft / Queued',
      value: draftsCount.toString(),
      change: draftsCount === 1 ? '1 draft post' : `${draftsCount} draft posts`,
      changeColor: 'text.secondary',
      icon: <IconClock size={24} style={{ color: '#9c27b0' }} />,
      bgColor: 'rgba(156, 39, 176, 0.08)',
    },
  ];

  // Slice the last 3 recently modified/created blogs
  const recentBlogs = blogs.slice(0, 3);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here is a summary of your website performance, SEO scores, and blogs.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/admin/dashboard/blogs/new"
          startIcon={<IconPlus size={18} />}
          sx={{
            py: 1.2,
            px: 2.5,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 14px 0 rgba(26,79,214,0.3)',
          }}
        >
          New Blog Post
        </Button>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #e5eaef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {metric.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                  {metric.value}
                </Typography>
                <Typography variant="caption" color={metric.changeColor} sx={{ fontWeight: 600 }}>
                  {metric.change}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  backgroundColor: metric.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {metric.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Dynamic Analytics SVG Chart Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={1}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid #e5eaef',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Weekly Page Views / Visitors
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Live insights updated 5m ago
              </Typography>
            </Box>

            {/* Premium Custom SVG Graph */}
            <Box sx={{ width: '100%', height: '220px', position: 'relative' }}>
              <svg viewBox="0 0 500 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A4FD6" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#1A4FD6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="190" x2="500" y2="190" stroke="#e2e8f0" strokeWidth="1.5" />

                {/* Graph Area */}
                <path
                  d="M 0 160 C 50 140, 75 80, 125 70 C 175 60, 200 130, 250 110 C 300 90, 325 50, 375 40 C 425 30, 450 90, 500 80 L 500 190 L 0 190 Z"
                  fill="url(#chartGradient)"
                />

                {/* Graph Line */}
                <path
                  d="M 0 160 C 50 140, 75 80, 125 70 C 175 60, 200 130, 250 110 C 300 90, 325 50, 375 40 C 425 30, 450 90, 500 80"
                  fill="none"
                  stroke="#1A4FD6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Dots on Graph */}
                <circle cx="125" cy="70" r="5" fill="#1A4FD6" stroke="#fff" strokeWidth="2" />
                <circle cx="250" cy="110" r="5" fill="#1A4FD6" stroke="#fff" strokeWidth="2" />
                <circle cx="375" cy="40" r="5" fill="#17C653" stroke="#fff" strokeWidth="2" />
                <circle cx="500" cy="80" r="5" fill="#1A4FD6" stroke="#fff" strokeWidth="2" />

                {/* X Axis Labels */}
                <text x="0" y="215" fill="#94a3b8" fontSize="10" fontWeight="600">Mon</text>
                <text x="83" y="215" fill="#94a3b8" fontSize="10" fontWeight="600">Tue</text>
                <text x="166" y="215" fill="#94a3b8" fontSize="10" fontWeight="600">Wed</text>
                <text x="250" y="215" fill="#94a3b8" fontSize="10" fontWeight="600">Thu</text>
                <text x="333" y="215" fill="#94a3b8" fontSize="10" fontWeight="600">Fri</text>
                <text x="416" y="215" fill="#94a3b8" fontSize="10" fontWeight="600">Sat</text>
                <text x="490" y="215" fill="#94a3b8" fontSize="10" fontWeight="600">Sun</text>
              </svg>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Blog Posts / Activites Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={1}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid #e5eaef',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Recent Blog Operations
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}>
              {recentBlogs.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No blog operations recorded yet.
                  </Typography>
                </Box>
              ) : (
                recentBlogs.map((post, idx) => (
                  <Box key={idx}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          pr: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: post.status === 'published' ? 'rgba(23, 198, 83, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                          color: post.status === 'published' ? '#17C653' : '#64748b',
                          px: 1,
                          py: 0.2,
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                        }}
                      >
                        {post.status}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#1A4FD6' }}>
                        SEO: {calculateSeoScore(post)}%
                      </Typography>
                    </Box>
                    {idx < recentBlogs.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))
              )}
            </Box>

            <Button
              variant="outlined"
              color="primary"
              component={Link}
              href="/admin/dashboard"
              fullWidth
              sx={{
                py: 1,
                mt: 3,
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Manage All Blogs
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
