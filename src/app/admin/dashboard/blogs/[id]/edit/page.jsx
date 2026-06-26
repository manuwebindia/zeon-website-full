'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import BlogEditor from '@/components/admin/BlogEditor';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('zeon_admin_token');
        const res = await fetch(`/api/admin/blogs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch blog post');
        }

        setBlog(data.blog);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 12,
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading article configuration...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="outlined"
          component={Link}
          href="/admin/dashboard"
          startIcon={<IconArrowLeft size={18} />}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return <BlogEditor mode="edit" initialData={blog} />;
}
