'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import slugify from 'slugify';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  IconDeviceFloppy,
  IconArrowLeft,
  IconCloudUpload,
  IconPhoto,
  IconTrash,
  IconVideo,
  IconBrandYoutube,
  IconStar,
  IconStarFilled,
  IconPencil,
  IconArrowLeft as IconMoveLeft,
  IconArrowRight as IconMoveRight,
  IconExternalLink,
  IconPlus,
} from '@tabler/icons-react';
import MediaPickerDialog from '@/components/admin/MediaPickerDialog';
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';

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

const CATEGORY_PRESETS = [
  'Celebrations',
  'Graduations',
  'Events',
  'Campus Life',
  'Student Life',
  'Workshops',
  'Videos',
];

const EMPTY_FORM = {
  title: '',
  slug: '',
  category: '',
  description: '',
  coverImage: '',
  seoTitle: '',
  seoDescription: '',
  allowIndexing: true,
  status: 'draft',
  sortOrder: 0,
  eventDate: '',
  images: [], // array of { id, type: 'image' | 'video', src, videoUrl, thumbnail, alt, caption, sortOrder }
};

export default function AdminGalleryEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const albumId = isNew ? null : params.id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Media picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('cover'); // 'cover' | 'photos' | 'videoCover'

  // Dedicated Video Modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoForm, setVideoForm] = useState({
    videoUrl: '',
    thumbnail: '',
    alt: '',
    caption: '',
  });

  // Dedicated Item Edit Modal state
  const [itemEditModalOpen, setItemEditModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [itemEditForm, setItemEditForm] = useState({
    type: 'image',
    src: '',
    videoUrl: '',
    thumbnail: '',
    alt: '',
    caption: '',
  });

  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  useEffect(() => {
    const ok = isNew ? can('gallery.create') : can('gallery.edit');
    if (!ok) router.replace('/admin/dashboard/gallery');
  }, [router, isNew]);

  // Load existing album
  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/gallery/${albumId}`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load album');
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          category: data.category || '',
          description: data.description || '',
          coverImage: data.coverImage || '',
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          allowIndexing: data.allowIndexing !== false,
          status: data.status || 'draft',
          sortOrder: data.sortOrder ?? 0,
          eventDate: data.eventDate ? data.eventDate.slice(0, 10) : '',
          images: (data.images || []).map((item, idx) => ({
            id: item.id || `item-${idx}`,
            type: item.type === 'video' ? 'video' : 'image',
            src: item.src || item.thumbnail || '',
            videoUrl: item.videoUrl || '',
            thumbnail: item.thumbnail || (item.type === 'video' ? item.src : ''),
            alt: item.alt || '',
            caption: item.caption || '',
            sortOrder: item.sortOrder ?? idx,
          })),
        });
      } catch (err) {
        showSnackbar(err.message, 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [albumId, isNew]);

  // Auto-slug when title changes in new mode if slug hasn't been manually edited
  const handleTitleChange = (val) => {
    setForm((p) => {
      const updated = { ...p, title: val };
      if (isNew && (!p.slug || p.slug === slugify(p.title, { lower: true, strict: true }))) {
        updated.slug = slugify(val, { lower: true, strict: true });
      }
      return updated;
    });
  };

  const uploadFile = async (file, folder = 'gallery') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      if (mediaTarget === 'cover') {
        const url = await uploadFile(files[0]);
        setForm((p) => ({ ...p, coverImage: url }));
        showSnackbar('Album cover updated');
      } else if (mediaTarget === 'videoCover') {
        const url = await uploadFile(files[0]);
        if (itemEditModalOpen) {
          setItemEditForm((p) => ({ ...p, thumbnail: url, src: url }));
        } else {
          setVideoForm((p) => ({ ...p, thumbnail: url }));
        }
        showSnackbar('Video cover image uploaded');
      } else {
        // Upload inner photos in bulk
        const urls = await Promise.all(files.map((f) => uploadFile(f)));
        setForm((p) => {
          const newItems = urls.map((src, idx) => ({
            id: `new-${Date.now()}-${idx}`,
            type: 'image',
            src,
            videoUrl: '',
            thumbnail: '',
            alt: '',
            caption: '',
            sortOrder: p.images.length + idx,
          }));
          // If no cover image set yet, automatically set the first uploaded photo as cover
          const coverImage = p.coverImage || newItems[0]?.src || '';
          return {
            ...p,
            coverImage,
            images: [...p.images, ...newItems],
          };
        });
        showSnackbar(`Uploaded ${urls.length} photo${urls.length === 1 ? '' : 's'}`);
      }
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Set any item as Album Cover
  const handleSetCover = (item) => {
    const coverUrl = item.type === 'video' ? (item.thumbnail || item.src) : item.src;
    if (!coverUrl) {
      showSnackbar('This item does not have a valid image to set as cover', 'error');
      return;
    }
    setForm((p) => ({ ...p, coverImage: coverUrl }));
    showSnackbar('Album cover image updated from selected media item!');
  };

  // Move item left / right (reordering)
  const moveItem = (index, direction) => {
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= form.images.length) return;
    setForm((p) => {
      const copy = [...p.images];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return {
        ...p,
        images: copy.map((item, idx) => ({ ...item, sortOrder: idx })),
      };
    });
  };

  // Remove inner item
  const removeItem = (index) => {
    setForm((p) => {
      const itemToRemove = p.images[index];
      const updatedImages = p.images.filter((_, i) => i !== index).map((img, i) => ({ ...img, sortOrder: i }));
      // If the removed item was the coverImage, keep it or clear if it matches
      return {
        ...p,
        images: updatedImages,
      };
    });
  };

  // Open item edit modal
  const openEditItemModal = (index) => {
    const item = form.images[index];
    setEditingItemIndex(index);
    setItemEditForm({
      type: item.type || 'image',
      src: item.src || '',
      videoUrl: item.videoUrl || '',
      thumbnail: item.thumbnail || (item.type === 'video' ? item.src : ''),
      alt: item.alt || '',
      caption: item.caption || '',
    });
    setItemEditModalOpen(true);
  };

  const handleSaveItemEdit = () => {
    if (editingItemIndex === null) return;
    setForm((p) => {
      const copy = [...p.images];
      const current = copy[editingItemIndex];
      copy[editingItemIndex] = {
        ...current,
        ...itemEditForm,
        src: itemEditForm.type === 'video' ? (itemEditForm.thumbnail || itemEditForm.src) : itemEditForm.src,
      };
      return { ...p, images: copy };
    });
    setItemEditModalOpen(false);
    setEditingItemIndex(null);
    showSnackbar('Media item updated');
  };

  // Open Add Video Modal
  const openAddVideoModal = () => {
    setVideoForm({
      videoUrl: '',
      thumbnail: '',
      alt: '',
      caption: '',
    });
    setVideoModalOpen(true);
  };

  const handleVideoUrlChange = (url) => {
    const ytId = getYouTubeId(url);
    const autoThumb = ytId ? getYouTubeThumbnail(ytId, 'hq') : '';
    setVideoForm((p) => ({
      ...p,
      videoUrl: url,
      // If user hasn't chosen custom thumbnail yet, auto-populate with YT thumbnail
      thumbnail: p.thumbnail && !p.thumbnail.includes('img.youtube.com') ? p.thumbnail : autoThumb,
    }));
  };

  const handleAddVideoSubmit = () => {
    const ytId = getYouTubeId(videoForm.videoUrl);
    if (!ytId) {
      showSnackbar('Please enter a valid YouTube video link', 'error');
      return;
    }

    const finalThumbnail = videoForm.thumbnail.trim() || getYouTubeThumbnail(ytId, 'hq');

    const newVideoItem = {
      id: `vid-${Date.now()}`,
      type: 'video',
      src: finalThumbnail,
      videoUrl: videoForm.videoUrl.trim(),
      thumbnail: finalThumbnail,
      alt: videoForm.alt.trim() || form.title,
      caption: videoForm.caption.trim() || null,
      sortOrder: form.images.length,
    };

    setForm((p) => ({
      ...p,
      coverImage: p.coverImage || finalThumbnail,
      images: [...p.images, newVideoItem],
    }));

    setVideoModalOpen(false);
    showSnackbar('YouTube video added to album');
  };

  // Save album to server
  const handleSave = async () => {
    if (!form.title.trim()) {
      showSnackbar('Album Title is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title, { lower: true, strict: true }),
        category: form.category.trim() || null,
        sortOrder: Number(form.sortOrder) || 0,
        images: form.images.map((img, idx) => ({
          type: img.type === 'video' ? 'video' : 'image',
          src: img.src || img.thumbnail || '',
          videoUrl: img.videoUrl?.trim() || null,
          thumbnail: img.thumbnail?.trim() || (img.type === 'video' ? img.src : null),
          alt: img.alt?.trim() || null,
          caption: img.caption?.trim() || null,
          sortOrder: idx,
        })),
      };

      const url = isNew ? '/api/admin/gallery' : `/api/admin/gallery/${albumId}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save album');

      showSnackbar('Album saved successfully!');
      if (isNew) {
        router.replace(`/admin/dashboard/gallery/${data.id}/edit`);
      }
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const photosCount = form.images.filter((i) => i.type !== 'video').length;
  const videosCount = form.images.filter((i) => i.type === 'video').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 14 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton component={Link} href="/admin/dashboard/gallery" sx={{ bgcolor: '#fff', border: '1px solid #e5eaef' }}>
            <IconArrowLeft size={18} />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {isNew ? 'New Gallery Album' : 'Edit Album & Media'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isNew ? 'Create a new gallery album or media group' : `Managing /gallery/${form.slug}`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {!isNew && form.slug && (
            <Button
              component={Link}
              href={`/gallery/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<IconExternalLink size={16} />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              View on Live Site
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size={16} />}
            onClick={handleSave}
            disabled={saving}
            sx={{ textTransform: 'none', borderRadius: 2, px: 3, fontWeight: 600 }}
          >
            {saving ? 'Saving...' : 'Save Album'}
          </Button>
        </Box>
      </Box>

      {/* Two Column CMS Layout */}
      <Grid container spacing={3}>
        {/* ── LEFT COLUMN (Content & Media Management) ── */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Album Information */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Album Details
            </Typography>
            <Grid container spacing={2.5}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  required
                  label="Album Title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Onam Celebration 2025"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="URL Slug"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  helperText={`Public URL: /gallery/${form.slug || 'your-slug'}`}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Event Date"
                  value={form.eventDate}
                  onChange={(e) => setForm((p) => ({ ...p, eventDate: e.target.value }))}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Category / Group"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  placeholder="e.g. Celebrations, Events, Campus Life, Videos"
                  helperText="Use to group or filter albums on the gallery page"
                />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', mr: 0.5 }}>
                    Quick presets:
                  </Typography>
                  {CATEGORY_PRESETS.map((preset) => (
                    <Chip
                      key={preset}
                      label={preset}
                      size="small"
                      clickable
                      onClick={() => setForm((p) => ({ ...p, category: preset }))}
                      color={form.category === preset ? 'primary' : 'default'}
                      variant={form.category === preset ? 'filled' : 'outlined'}
                      sx={{ fontSize: '0.72rem' }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Album Description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="A brief memory or context about this celebration or event..."
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Inner Images & Videos Manager */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Inner Media Items ({form.images.length})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {photosCount} photo{photosCount === 1 ? '' : 's'} · {videosCount} video{videosCount === 1 ? '' : 's'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={uploading ? <CircularProgress size={14} /> : <IconCloudUpload size={16} />}
                  onClick={() => {
                    setMediaTarget('photos');
                    if (fileInputRef.current) {
                      fileInputRef.current.multiple = true;
                      fileInputRef.current.click();
                    }
                  }}
                  disabled={uploading}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Upload Photos
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<IconPhoto size={16} />}
                  onClick={() => {
                    setMediaTarget('photos');
                    setMediaPickerOpen(true);
                  }}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Media Library
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  startIcon={<IconBrandYoutube size={16} />}
                  onClick={openAddVideoModal}
                  sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                >
                  Add Video (YouTube)
                </Button>
              </Box>
            </Box>

            {!form.images.length ? (
              <Box
                sx={{
                  p: 5,
                  textAlign: 'center',
                  border: '2px dashed #e5eaef',
                  borderRadius: 2.5,
                  bgcolor: '#FAFBFD',
                }}
              >
                <IconPhoto size={36} stroke={1.2} style={{ opacity: 0.35, marginBottom: 8 }} />
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                  No images or videos added to this album yet.
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, mb: 2 }}>
                  Upload photos, choose from media library, or add YouTube video links above.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 2,
                }}
              >
                {form.images.map((item, idx) => {
                  const isCover = (form.coverImage && (form.coverImage === item.src || form.coverImage === item.thumbnail));
                  const isVid = item.type === 'video';
                  const displayImg = isVid ? (item.thumbnail || item.src) : item.src;

                  return (
                    <Box
                      key={item.id || `${item.src}-${idx}`}
                      sx={{
                        position: 'relative',
                        border: isCover ? '2px solid #1A4FD6' : '1px solid #e5eaef',
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: '#fff',
                        boxShadow: isCover ? '0 4px 12px rgba(26, 79, 214, 0.15)' : 'none',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: isCover ? '#1A4FD6' : '#cbd5e1',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                      }}
                    >
                      {/* Image Preview */}
                      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4/3', bgcolor: '#f1f5f9' }}>
                        {displayImg ? (
                          <Box
                            component="img"
                            src={displayImg}
                            alt={item.alt || ''}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.disabled' }}>
                            <IconPhoto size={24} />
                          </Box>
                        )}

                        {/* Video Play Overlay */}
                        {isVid && (
                          <Box
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              bgcolor: 'rgba(0,0,0,0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Box
                              sx={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                bgcolor: '#FF0000',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                              }}
                            >
                              <IconBrandYoutube size={20} />
                            </Box>
                          </Box>
                        )}

                        {/* Badges top left */}
                        <Box sx={{ position: 'absolute', top: 6, left: 6, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {isCover && (
                            <Chip
                              icon={<IconStarFilled size={12} style={{ color: '#fff' }} />}
                              label="Cover"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                bgcolor: '#1A4FD6',
                                color: '#fff',
                                '& .MuiChip-icon': { ml: '4px', mr: '-2px' },
                              }}
                            />
                          )}
                          {isVid && (
                            <Chip
                              label="Video"
                              size="small"
                              color="error"
                              sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }}
                            />
                          )}
                        </Box>
                      </Box>

                      {/* Card Content & Details */}
                      <Box sx={{ p: 1.2 }}>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '0.75rem',
                            color: 'text.primary',
                          }}
                        >
                          {item.alt || (isVid ? 'YouTube Video' : `Photo #${idx + 1}`)}
                        </Typography>

                        {/* Action Buttons Toolbar */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 0.8, borderTop: '1px solid #f1f5f9' }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {/* Set Cover Star Button */}
                            <Tooltip title={isCover ? 'Current Album Cover' : 'Set as Album Cover'}>
                              <IconButton
                                size="small"
                                onClick={() => handleSetCover(item)}
                                sx={{
                                  p: 0.5,
                                  color: isCover ? '#1A4FD6' : 'text.secondary',
                                  '&:hover': { color: '#1A4FD6' },
                                }}
                              >
                                {isCover ? <IconStarFilled size={15} /> : <IconStar size={15} />}
                              </IconButton>
                            </Tooltip>

                            {/* Edit Item Details Button */}
                            <Tooltip title="Edit Alt & Details">
                              <IconButton
                                size="small"
                                onClick={() => openEditItemModal(idx)}
                                sx={{ p: 0.5, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                              >
                                <IconPencil size={15} />
                              </IconButton>
                            </Tooltip>

                            {/* Reorder Left */}
                            {idx > 0 && (
                              <Tooltip title="Move Left">
                                <IconButton
                                  size="small"
                                  onClick={() => moveItem(idx, 'left')}
                                  sx={{ p: 0.5, color: 'text.secondary' }}
                                >
                                  <IconMoveLeft size={14} />
                                </IconButton>
                              </Tooltip>
                            )}

                            {/* Reorder Right */}
                            {idx < form.images.length - 1 && (
                              <Tooltip title="Move Right">
                                <IconButton
                                  size="small"
                                  onClick={() => moveItem(idx, 'right')}
                                  sx={{ p: 0.5, color: 'text.secondary' }}
                                >
                                  <IconMoveRight size={14} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>

                          {/* Delete Item */}
                          <Tooltip title="Delete Item">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeItem(idx)}
                              sx={{ p: 0.5 }}
                            >
                              <IconTrash size={15} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* ── RIGHT COLUMN (Sidebar Settings) ── */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Status & Publication Card */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Publishing & Visibility
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                select
                size="small"
                label="Status"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              >
                <MenuItem value="draft">Draft (Hidden from public)</MenuItem>
                <MenuItem value="published">Published (Visible on /gallery)</MenuItem>
              </TextField>

              <TextField
                fullWidth
                type="number"
                size="small"
                label="Sort Order"
                value={form.sortOrder}
                onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
                helperText="Lower numbers appear first on gallery list"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.allowIndexing}
                    onChange={(e) => setForm((p) => ({ ...p, allowIndexing: e.target.checked }))}
                  />
                }
                label="Allow Search Engine Indexing"
              />

              <Button
                variant="contained"
                fullWidth
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size={16} />}
                onClick={handleSave}
                disabled={saving}
                sx={{ textTransform: 'none', py: 1.2, borderRadius: 2, fontWeight: 700 }}
              >
                {saving ? 'Saving...' : 'Save Album'}
              </Button>
            </Box>
          </Paper>

          {/* Album Cover Card */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
              Album Cover
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              This image represents the album card on /gallery. You can also click the star icon on any inner photo/video to set it as cover.
            </Typography>

            {form.coverImage ? (
              <Box sx={{ position: 'relative', mb: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #e5eaef' }}>
                <Box
                  component="img"
                  src={form.coverImage}
                  alt="Album cover"
                  sx={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#f8fafc',
                  border: '1px dashed #e5eaef',
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <IconPhoto size={28} stroke={1.2} style={{ opacity: 0.35, marginBottom: 4 }} />
                <Typography variant="caption" color="text.secondary" display="block">
                  No cover image selected yet.
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={uploading ? <CircularProgress size={14} /> : <IconCloudUpload size={14} />}
                onClick={() => {
                  setMediaTarget('cover');
                  if (fileInputRef.current) {
                    fileInputRef.current.multiple = false;
                    fileInputRef.current.click();
                  }
                }}
                disabled={uploading}
                sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.78rem' }}
              >
                Upload Cover
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<IconPhoto size={14} />}
                onClick={() => {
                  setMediaTarget('cover');
                  setMediaPickerOpen(true);
                }}
                sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.78rem' }}
              >
                Media Library
              </Button>
              {form.coverImage && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => setForm((p) => ({ ...p, coverImage: '' }))}
                  sx={{ textTransform: 'none', fontSize: '0.78rem' }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Paper>

          {/* SEO Settings Card */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              SEO Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="SEO Title"
                value={form.seoTitle}
                onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
                placeholder={form.title ? `${form.title} | Gallery | Zeon Academy` : ''}
                helperText="Leave empty to use default album title"
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                label="SEO Description"
                value={form.seoDescription}
                onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
                placeholder="Meta description for search engines..."
                helperText="Recommended: 120-160 characters"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Hidden file input for uploads */}
      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedUrl={mediaTarget === 'cover' ? form.coverImage : ''}
        title={mediaTarget === 'cover' ? 'Select Album Cover' : mediaTarget === 'videoCover' ? 'Select Video Cover Image' : 'Select Photos'}
        onSelect={(url) => {
          if (mediaTarget === 'cover') {
            setForm((p) => ({ ...p, coverImage: url }));
            showSnackbar('Cover image updated');
          } else if (mediaTarget === 'videoCover') {
            if (itemEditModalOpen) {
              setItemEditForm((p) => ({ ...p, thumbnail: url, src: url }));
            } else {
              setVideoForm((p) => ({ ...p, thumbnail: url }));
            }
            showSnackbar('Video cover selected');
          } else {
            // Add to inner images
            setForm((p) => {
              const newItem = {
                id: `lib-${Date.now()}`,
                type: 'image',
                src: url,
                videoUrl: '',
                thumbnail: '',
                alt: '',
                caption: '',
                sortOrder: p.images.length,
              };
              return {
                ...p,
                coverImage: p.coverImage || url,
                images: [...p.images, newItem],
              };
            });
            showSnackbar('Photo added from media library');
          }
        }}
      />

      {/* ── ADD YOUTUBE VIDEO MODAL ── */}
      <Dialog
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconBrandYoutube color="#FF0000" size={24} />
          Add YouTube Video
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Paste a YouTube link. We automatically fetch the video thumbnail, or you can select a custom image cover.
          </Typography>

          <TextField
            fullWidth
            required
            label="YouTube Video Link"
            value={videoForm.videoUrl}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            sx={{ mb: 2 }}
            helperText={
              getYouTubeId(videoForm.videoUrl)
                ? `✔ Valid YouTube ID: ${getYouTubeId(videoForm.videoUrl)}`
                : 'Supports full URL, youtu.be, shorts, and embed links'
            }
          />

          {/* Video Thumbnail / Cover Preview & Selector */}
          <Box sx={{ mb: 2.5, p: 2, bgcolor: '#f8fafc', border: '1px solid #e5eaef', borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Video Cover Image (Thumbnail)
            </Typography>
            {videoForm.thumbnail ? (
              <Box sx={{ position: 'relative', width: '100%', height: 160, borderRadius: 1.5, overflow: 'hidden', mb: 1.5 }}>
                <Box
                  component="img"
                  src={videoForm.thumbnail}
                  alt="Video thumbnail"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'rgba(0,0,0,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#FF0000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconBrandYoutube size={22} />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Paste a YouTube link above to automatically load the video thumbnail.
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<IconCloudUpload size={14} />}
                onClick={() => {
                  setMediaTarget('videoCover');
                  if (fileInputRef.current) {
                    fileInputRef.current.multiple = false;
                    fileInputRef.current.click();
                  }
                }}
                sx={{ textTransform: 'none', borderRadius: 1.5, fontSize: '0.75rem' }}
              >
                Upload Custom Cover
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<IconPhoto size={14} />}
                onClick={() => {
                  setMediaTarget('videoCover');
                  setMediaPickerOpen(true);
                }}
                sx={{ textTransform: 'none', borderRadius: 1.5, fontSize: '0.75rem' }}
              >
                From Media Library
              </Button>
              {getYouTubeId(videoForm.videoUrl) && (
                <Button
                  size="small"
                  onClick={() => {
                    const id = getYouTubeId(videoForm.videoUrl);
                    setVideoForm((p) => ({ ...p, thumbnail: getYouTubeThumbnail(id, 'hq') }));
                  }}
                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                  Reset to YouTube Thumb
                </Button>
              )}
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Video Title / Alt Text"
            value={videoForm.alt}
            onChange={(e) => setVideoForm((p) => ({ ...p, alt: e.target.value }))}
            placeholder="e.g. Highlights from Onam Celebration"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Caption (optional)"
            value={videoForm.caption}
            onChange={(e) => setVideoForm((p) => ({ ...p, caption: e.target.value }))}
            placeholder="Optional caption displayed under video"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setVideoModalOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleAddVideoSubmit}
            disabled={!getYouTubeId(videoForm.videoUrl)}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Add Video
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── EDIT ITEM DETAILS MODAL ── */}
      <Dialog
        open={itemEditModalOpen}
        onClose={() => setItemEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {itemEditForm.type === 'video' ? 'Edit Video Details' : 'Edit Photo Details'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {itemEditForm.type === 'video' && (
            <TextField
              fullWidth
              label="YouTube URL"
              value={itemEditForm.videoUrl}
              onChange={(e) => {
                const url = e.target.value;
                const id = getYouTubeId(url);
                setItemEditForm((p) => ({
                  ...p,
                  videoUrl: url,
                  thumbnail: (!p.thumbnail || p.thumbnail.includes('img.youtube.com')) && id ? getYouTubeThumbnail(id, 'hq') : p.thumbnail,
                }));
              }}
              sx={{ mb: 2 }}
            />
          )}

          {/* Cover preview for item */}
          <Box sx={{ mb: 2.5, p: 2, bgcolor: '#f8fafc', border: '1px solid #e5eaef', borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              {itemEditForm.type === 'video' ? 'Video Cover Image' : 'Photo Image'}
            </Typography>
            <Box sx={{ width: '100%', height: 160, borderRadius: 1.5, overflow: 'hidden', mb: 1.5 }}>
              <Box
                component="img"
                src={itemEditForm.thumbnail || itemEditForm.src}
                alt=""
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<IconPhoto size={14} />}
                onClick={() => {
                  setMediaTarget(itemEditForm.type === 'video' ? 'videoCover' : 'photos');
                  setMediaPickerOpen(true);
                }}
                sx={{ textTransform: 'none', fontSize: '0.75rem' }}
              >
                Change from Media Library
              </Button>
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Alt / Title Text"
            value={itemEditForm.alt}
            onChange={(e) => setItemEditForm((p) => ({ ...p, alt: e.target.value }))}
            sx={{ mb: 2 }}
            helperText="Accessibility & SEO description"
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Caption"
            value={itemEditForm.caption}
            onChange={(e) => setItemEditForm((p) => ({ ...p, caption: e.target.value }))}
            placeholder="Caption displayed in lightbox"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setItemEditModalOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveItemEdit} sx={{ textTransform: 'none', borderRadius: 2 }}>
            Save Details
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
