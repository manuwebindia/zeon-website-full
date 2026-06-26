'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import { IconPlus, IconEdit, IconTrash, IconFileText, IconSearch } from '@tabler/icons-react';

export default function AdminDashboardPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      blog.title.toLowerCase().includes(query) ||
      (blog.slug && blog.slug.toLowerCase().includes(query)) ||
      (blog.focusKeyword && blog.focusKeyword.toLowerCase().includes(query))
    );
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('zeon_admin_token');
      const res = await fetch('/api/admin/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch blogs');
      }

      setBlogs(data.blogs || []);
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBlog) return;
    setDeleting(true);

    try {
      const token = localStorage.getItem('zeon_admin_token');
      const res = await fetch(`/api/admin/blogs/${selectedBlog.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete blog');
      }

      // Update state
      setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));
      showSnackbar('Blog deleted successfully');
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedBlog(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box>
      {/* Header section with page title & action button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Blog Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Publish and manage all your blogs dynamically here.
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
          New Post
        </Button>
      </Box>

      {/* Main content table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : blogs.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            py: 10,
            px: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px dashed #e5eaef',
          }}
        >
          <IconFileText size={48} stroke={1.2} style={{ color: '#7C8FAC', marginBottom: '16px' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No Blog Posts Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Write your very first blog post to go digital.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/admin/dashboard/blogs/new"
            startIcon={<IconPlus size={18} />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Create First Post
          </Button>
        </Paper>
      ) : (
        <>
          {/* Search Input */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search blogs by title, slug, or focus keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: 'text.secondary', mr: 1 }}>
                      <IconSearch size={20} />
                    </InputAdornment>
                  ),
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  border: '1px solid #e5eaef',
                  boxShadow: '0 2px 8px -2px rgba(0,0,0,0.05)',
                  '& fieldset': { border: 'none' },
                  '&:hover': {
                    boxShadow: '0 4px 12px -2px rgba(0,0,0,0.08)',
                  },
                  '&.Mui-focused': {
                    border: '1px solid #1A4FD6',
                    boxShadow: '0 4px 12px -2px rgba(26,79,214,0.15)',
                  }
                }
              }}
            />
          </Box>

          {filteredBlogs.length === 0 ? (
            <Paper
              elevation={1}
              sx={{
                py: 8,
                px: 4,
                textAlign: 'center',
                borderRadius: 3,
                border: '1px dashed #e5eaef',
              }}
            >
              <IconSearch size={48} stroke={1.2} style={{ color: '#7C8FAC', marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                No matching results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We couldn't find any blogs matching "{searchQuery}". Try typing another keyword, slug, or title.
              </Typography>
            </Paper>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)',
                border: '1px solid #e5eaef',
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: '#F2F6FA' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status / Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Indexing</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBlogs.map((blog) => (
                    <TableRow key={blog.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {blog.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {blog.slug}
                        </Typography>
                        {blog.focusKeyword && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                              Keyword:
                            </Typography>
                            <Typography variant="caption" color="text.primary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                              {blog.focusKeyword}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                          <Chip
                            label={blog.status === 'published' ? 'Published' : 'Draft'}
                            size="small"
                            color={blog.status === 'published' ? 'success' : 'default'}
                            variant={blog.status === 'published' ? 'filled' : 'outlined'}
                            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={blog.allowIndexing ? 'Index' : 'No Index'}
                          size="small"
                          color={blog.allowIndexing ? 'info' : 'error'}
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            component={Link}
                            href={`/admin/dashboard/blogs/${blog.id}/edit`}
                            title="Edit Blog"
                          >
                            <IconEdit size={18} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(blog)}
                            title="Delete Blog"
                          >
                            <IconTrash size={18} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Blog Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the blog post{' '}
            <strong>"{selectedBlog?.title}"</strong>? This action is permanent and
            cannot be undone. It will remove the blog immediately from the public website.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            disabled={deleting}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
          >
            {deleting ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
