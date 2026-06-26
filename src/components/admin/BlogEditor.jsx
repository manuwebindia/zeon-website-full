'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  IconArrowLeft,
  IconPlus,
  IconPhoto,
  IconDeviceFloppy,
} from '@tabler/icons-react';
import Link from 'next/link';

// Import child components
import SortableBlock from './SortableBlock';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import SeoFields from './SeoFields';
import FeaturedImageUpload from './FeaturedImageUpload';
import TagCategoryFields from './TagCategoryFields';
import SeoScorePanel from './SeoScorePanel';
import TocPreview from './TocPreview';
import SocialFields from './SocialFields';
import SchemaMarkupFields from './SchemaMarkupFields';

export default function BlogEditor({ mode, initialData }) {
  const router = useRouter();

  // ── Core blog fields ──────────────────────────────────────
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(mode === 'create');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState([]);
  const [status, setStatus] = useState('draft');
  const [allowIndexing, setAllowIndexing] = useState(true);

  // ── Phase 1: Taxonomy & Focus Keyword ─────────────────────
  const [focusKeyword, setFocusKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);

  // ── Phase 3: Social / OG Overrides ────────────────────────
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // ── Phase 4: Schema Markup ─────────────────────────────────
  const [articleType, setArticleType] = useState('Article');
  const [schemaFaqItems, setSchemaFaqItems] = useState([]);
  const [schemaHowToSteps, setSchemaHowToSteps] = useState([]);

  // ── Auto-save (Auto-draft) state and refs ─────────────────
  const [autoDraftId, setAutoDraftId] = useState(initialData?.id || null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle');
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [navTarget, setNavTarget] = useState(null);

  const isAutoSaving = useRef(false);
  const autoSaveTimer = useRef(null);
  const debounceTimer = useRef(null);
  const latestStateRef = useRef({});
  const hasLoadedData = useRef(false);

  // ── UI state ──────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit' && !initialData);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // ── Permission gating ─────────────────────────────────────
  const [canPublish, setCanPublish] = useState(false);
  useEffect(() => {
    try {
      const perms = JSON.parse(localStorage.getItem('zeon_admin_permissions') || '[]');
      setCanPublish(perms.includes('*') || perms.includes('blogs.publish'));
    } catch {
      setCanPublish(false);
    }
  }, []);

  // ── Populate state from initialData (edit mode) ───────────
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setAutoSlug(false);
      setSeoTitle(initialData.seoTitle || '');
      setSeoDescription(initialData.seoDescription || '');
      setFeaturedImage(initialData.featuredImage || null);
      setFeaturedImageAlt(initialData.featuredImageAlt || '');
      setExcerpt(initialData.excerpt || '');
      setContent(initialData.content || []);
      setStatus(initialData.status || 'draft');
      setAllowIndexing(initialData.allowIndexing !== undefined ? initialData.allowIndexing : true);
      // Phase 1
      setFocusKeyword(initialData.focusKeyword || '');
      setCategory(initialData.category || '');
      setTags(Array.isArray(initialData.tags) ? initialData.tags : []);
      // Phase 3
      setOgTitle(initialData.ogTitle || '');
      setOgDescription(initialData.ogDescription || '');
      setOgImage(initialData.ogImage || '');
      setCanonicalUrl(initialData.canonicalUrl || '');
      // Phase 4
      setArticleType(initialData.articleType || 'Article');
      setSchemaFaqItems(Array.isArray(initialData.schemaFaqItems) ? initialData.schemaFaqItems : []);
      setSchemaHowToSteps(Array.isArray(initialData.schemaHowToSteps) ? initialData.schemaHowToSteps : []);
      
      const t = setTimeout(() => {
        hasLoadedData.current = true;
      }, 100);
      return () => clearTimeout(t);
    } else if (mode === 'create') {
      hasLoadedData.current = true;
    }
  }, [initialData, mode]);

  // ── Auto slug from title ──────────────────────────────────
  useEffect(() => {
    if (autoSlug && mode === 'create' && title) {
      setSlug(slugify(title, { lower: true, strict: true }));
    }
  }, [title, autoSlug, mode]);

  // ── Auto-save State-Ref Syncing ───────────────────────────
  // Sync all state values to a ref so timers/intervals can always access the freshest data
  // without re-creating timers on every keystroke (standard React timer pattern).
  useEffect(() => {
    latestStateRef.current = {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      featuredImageAlt,
      seoTitle,
      seoDescription,
      tags,
      status,
      focusKeyword,
      category,
      ogTitle,
      ogDescription,
      ogImage,
      canonicalUrl,
      articleType,
      schemaFaqItems,
      schemaHowToSteps,
      autoDraftId,
      isDirty,
    };
  }, [
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    featuredImageAlt,
    seoTitle,
    seoDescription,
    tags,
    status,
    focusKeyword,
    category,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    articleType,
    schemaFaqItems,
    schemaHowToSteps,
    autoDraftId,
    isDirty,
  ]);

  // ── Auto-save Dirty-Tracking Effect ───────────────────────
  // Dirty tracking for field changes. Skip setting isDirty during initial data population.
  useEffect(() => {
    if (!hasLoadedData.current) return;
    setIsDirty(true);
  }, [
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    featuredImageAlt,
    seoTitle,
    seoDescription,
    tags,
    allowIndexing,
    focusKeyword,
    category,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    articleType,
    schemaFaqItems,
    schemaHowToSteps,
  ]);

  // ── Silent Auto-Save API Dispatcher ───────────────────────
  const autoSave = useCallback(async (retrySlug = null) => {
    // Decision 9: Concurrency check to avoid overlapping saves
    if (isAutoSaving.current) return;

    const state = latestStateRef.current;

    // Decision 3: Skip if no unsaved changes
    if (!state.isDirty) return;

    // Decision 2: Don't auto-save in create mode until title has at least 3 characters
    if (!state.autoDraftId && (!state.title || state.title.trim().length < 3)) {
      return;
    }

    isAutoSaving.current = true;
    setAutoSaveStatus('saving');

    try {
      const token = localStorage.getItem('zeon_admin_token');
      const isEdit = !!state.autoDraftId;
      const url = isEdit
        ? `/api/admin/blogs/${state.autoDraftId}`
        : '/api/admin/blogs';
      
      const method = isEdit ? 'PATCH' : 'POST';

      // Decision 10: Slug fallbacks generated client-side
      let finalSlug = retrySlug || state.slug;
      if (!finalSlug.trim() && state.title.trim()) {
        finalSlug = slugify(state.title, { lower: true, strict: true });
      }

      // Build safe auto-save payload (Decision 5: omit status field entirely)
      const payload = {
        title: state.title,
        slug: finalSlug,
        seoTitle: state.seoTitle || state.title,
        seoDescription: state.seoDescription || state.excerpt,
        featuredImage: state.featuredImage,
        featuredImageAlt: state.featuredImageAlt,
        content: state.content,
        excerpt:
          state.excerpt ||
          state.content
            .find((b) => b.type === 'text')
            ?.html?.replace(/<[^>]*>/g, '')
            .slice(0, 150) ||
          '',
        allowIndexing: state.allowIndexing,
        focusKeyword: state.focusKeyword,
        category: state.category,
        tags: state.tags,
        ogTitle: state.ogTitle,
        ogDescription: state.ogDescription,
        ogImage: state.ogImage,
        canonicalUrl: state.canonicalUrl,
        articleType: state.articleType,
        schemaFaqItems: state.schemaFaqItems,
        schemaHowToSteps: state.schemaHowToSteps,
        isAutoDraft: true, // Decision 6: informs API to bypass revalidatePath
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Decision 10: Slug collision retry
      if (res.status === 409 && !retrySlug && !isEdit) {
        console.warn('[Auto-Save] Slug conflict 409. Retrying once with timestamp suffix...');
        const altSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
        isAutoSaving.current = false;
        return autoSave(altSlug);
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server error during auto-save');
      }

      // Update local auto-save success states (Decision 8)
      setAutoSaveStatus('saved');
      setLastSavedAt(new Date());
      setIsDirty(false);

      // Decision 7: silently update URL on initial draft creation to switch editor to edit mode
      if (!isEdit && data.blog?.id) {
        setAutoDraftId(data.blog.id);
        const nextUrl = `/admin/dashboard/blogs/${data.blog.id}`;
        router.replace(nextUrl, { scroll: false });
      }

    } catch (err) {
      console.error('[Auto-Save Failure]:', err);
      setAutoSaveStatus('error');
    } finally {
      isAutoSaving.current = false;
    }
  }, [router]);

  // ── Auto-save Timer Orchestration ─────────────────────────
  // Decision 1: Combined debounce (5s after typing) and interval fallback (30s)
  useEffect(() => {
    // Clear existing timers on every change
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);

    if (isDirty) {
      // 5-second debounce timer
      debounceTimer.current = setTimeout(() => {
        autoSave();
      }, 5000);

      // 30-second interval fallback timer
      autoSaveTimer.current = setInterval(() => {
        autoSave();
      }, 30000);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [
    isDirty,
    autoSave,
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    featuredImageAlt,
    seoTitle,
    seoDescription,
    tags,
    allowIndexing,
    focusKeyword,
    category,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    articleType,
    schemaFaqItems,
    schemaHowToSteps,
  ]);

  // ── Tab Close / Navigation Warn Guard ─────────────────────
  // Decision 3: browser tab closing navigation warning guard
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && autoDraftId !== null) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, autoDraftId]);

  // ── Tab Blur / Visibilitychange Save ──────────────────────
  // Decision 4: Trigger immediate save on tab switch/blur or window minimization
  useEffect(() => {
    const handleImmediateSave = () => {
      if (latestStateRef.current.isDirty) {
        autoSave();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleImmediateSave();
      }
    };

    window.addEventListener('blur', handleImmediateSave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleImmediateSave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoSave]);

  // ── Saved Status Duration Timer ───────────────────────────
  // Decision 8: Auto-save status display duration (saved state visible for 4s then fades)
  useEffect(() => {
    if (autoSaveStatus === 'saved') {
      const t = setTimeout(() => {
        setAutoSaveStatus('idle');
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [autoSaveStatus]);

  // ── Popstate & Navigation Click Interceptors ───────────────
  // Intercept all internal standard router navigations (sidebar clicks, links, back buttons)
  useEffect(() => {
    const handleAnchorClick = (e) => {
      if (!isDirty) return;

      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      
      // Intercept local admin navigation
      if (href && (href.startsWith('/') || href.startsWith('http://localhost') || href.startsWith(window.location.origin))) {
        // Exclude keyboard modifier open tab, target _blank, empty hash links
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || anchor.target === '_blank' || href === '#') {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        setNavTarget(href);
        setConfirmDialogOpen(true);
      }
    };

    document.addEventListener('click', handleAnchorClick, true);
    return () => {
      document.removeEventListener('click', handleAnchorClick, true);
    };
  }, [isDirty]);

  // Intercept standard browser back/forward buttons
  useEffect(() => {
    if (isDirty) {
      if (window.history.state?.blocked !== true) {
        window.history.pushState({ blocked: true }, '', window.location.pathname);
      }
    }
  }, [isDirty]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (isDirty) {
        // Prevent browser back transition by pushing the blocked state back
        window.history.pushState({ blocked: true }, '', window.location.pathname);
        setNavTarget('BACK');
        setConfirmDialogOpen(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isDirty]);

  // Dialog Navigation Callbacks
  const handleDiscardAndLeave = () => {
    setIsDirty(false);
    setConfirmDialogOpen(false);
    if (navTarget === 'BACK') {
      // Go back past the blocked entries to return to the previous page
      window.history.go(-2);
    } else {
      router.push(navTarget || '/admin/dashboard');
    }
  };

  const handleSaveAndLeave = async () => {
    setConfirmDialogOpen(false);
    // Silent API auto-save call to push current state to draft
    await autoSave();
    setIsDirty(false);
    if (navTarget === 'BACK') {
      window.history.go(-2);
    } else {
      router.push(navTarget || '/admin/dashboard');
    }
  };

  // ── DnD sensors ───────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ── Snackbar helpers ──────────────────────────────────────
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // ── Content block handlers ────────────────────────────────
  const addTextBlock = () => {
    setContent((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: 'text', html: '' },
    ]);
  };

  const addImageBlock = () => {
    setContent((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: 'image', src: '', alt: '', caption: '' },
    ]);
  };

  const removeBlock = (id) => {
    setContent((prev) => prev.filter((block) => block.id !== id));
  };

  const updateBlock = (id, updatedData) => {
    setContent((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...updatedData } : block))
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setContent((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ── Unified field change handler (SEO, Taxonomy, Social, Schema) ──
  const handleFieldChange = (field, value) => {
    switch (field) {
      // SEO
      case 'seoTitle':       setSeoTitle(value);       break;
      case 'seoDescription': setSeoDescription(value); break;
      case 'slug':           setSlug(value);            break;
      case 'allowIndexing':  setAllowIndexing(value);  break;
      case 'autoSlug':       setAutoSlug(value);        break;
      // Phase 1 — Taxonomy
      case 'focusKeyword':   setFocusKeyword(value);   break;
      case 'category':       setCategory(value);        break;
      case 'tags':           setTags(value);            break;
      // Phase 3 — Social
      case 'ogTitle':        setOgTitle(value);         break;
      case 'ogDescription':  setOgDescription(value);  break;
      case 'ogImage':        setOgImage(value);         break;
      case 'canonicalUrl':   setCanonicalUrl(value);   break;
      // Phase 4 — Schema
      case 'articleType':       setArticleType(value);       break;
      case 'schemaFaqItems':    setSchemaFaqItems(value);    break;
      case 'schemaHowToSteps':  setSchemaHowToSteps(value);  break;
      default: break;
    }
  };

  // ── Save / Publish handler ────────────────────────────────
  const handleSave = async (targetStatus) => {
    // Decision 9: Clear pending auto-save timers and reset dirty flag
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    setIsDirty(false);

    if (!title.trim()) {
      showSnackbar('Blog title is required', 'error');
      return;
    }

    if (!slug.trim()) {
      showSnackbar('Slug is required', 'error');
      return;
    }

    // Focus keyword required before publishing
    if (targetStatus === 'published' && !focusKeyword.trim()) {
      showSnackbar('Focus keyword is required before publishing', 'error');
      return;
    }

    if (featuredImage && !featuredImageAlt.trim()) {
      showSnackbar('Featured image alt text is required for SEO accessibility', 'error');
      return;
    }

    if (content.length === 0) {
      showSnackbar('Add at least one content block (text or image) to write content', 'error');
      return;
    }

    const emptyAltBlock = content.find(
      (b) => b.type === 'image' && b.src && !b.alt.trim()
    );
    if (emptyAltBlock) {
      showSnackbar('All content images must have Alt text for proper SEO and accessibility', 'error');
      return;
    }

    setSaving(true);

    const payload = {
      title,
      slug,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      featuredImage,
      featuredImageAlt,
      content,
      excerpt:
        excerpt ||
        content
          .find((b) => b.type === 'text')
          ?.html?.replace(/<[^>]*>/g, '')
          .slice(0, 150) ||
        '',
      status: targetStatus || status,
      allowIndexing,
      // Phase 1
      focusKeyword,
      category,
      tags,
      // Phase 3
      ogTitle,
      ogDescription,
      ogImage,
      canonicalUrl,
      // Phase 4
      articleType,
      schemaFaqItems,
      schemaHowToSteps,
    };

    try {
      const token = localStorage.getItem('zeon_admin_token');
      // Resolve blog ID from either initial data or existing auto-draft ID
      const blogId = initialData?.id || autoDraftId;
      const url =
        mode === 'create' && !blogId
          ? '/api/admin/blogs'
          : `/api/admin/blogs/${blogId}`;
      const method = mode === 'create' && !blogId ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save blog');
      }

      showSnackbar(`Blog successfully saved as ${targetStatus}!`);
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton component={Link} href="/admin/dashboard" color="inherit">
          <IconArrowLeft />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {mode === 'create' ? 'Create New Post' : 'Edit Blog Post'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag, write, upload, and optimize content for search indexing.
          </Typography>
        </Box>
      </Box>

      {/* Main Layout Grid */}
      <Grid container spacing={4}>

        {/* ── LEFT COLUMN ── */}
        <Grid size={{ xs: 12, lg: 8 }}>

          {/* Post Title */}
          <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e5eaef' }}>
            <TextField
              fullWidth
              label="Blog Post Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              slotProps={{
                htmlInput: { style: { fontSize: '1.25rem', fontWeight: 600 } },
              }}
              placeholder="Enter catch-eye title..."
            />
          </Paper>

          {/* Dynamic Content Blocks */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e5eaef',
              backgroundColor: '#FAFBFD',
              mb: 4,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
              Content Outline
            </Typography>

            {content.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  textAlign: 'center',
                  border: '2px dashed #b4c2d6',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  mb: 4,
                }}
              >
                <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                  Your article is currently empty. Add blocks below to construct your post.
                </Typography>
              </Box>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={content.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {content.map((block) => (
                    <SortableBlock key={block.id} id={block.id} onRemove={removeBlock}>
                      {block.type === 'text' ? (
                        <TextBlock
                          content={block.html}
                          onChange={(html) => updateBlock(block.id, { html })}
                        />
                      ) : (
                        <ImageBlock
                          src={block.src}
                          alt={block.alt}
                          caption={block.caption}
                          onUpdate={(data) => updateBlock(block.id, data)}
                        />
                      )}
                    </SortableBlock>
                  ))}
                </SortableContext>
              </DndContext>
            )}

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={addTextBlock}
                startIcon={<IconPlus size={16} />}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Add Text Section
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={addImageBlock}
                startIcon={<IconPhoto size={16} />}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Add Content Image
              </Button>
            </Stack>
          </Paper>

          {/* SEO Settings */}
          <SeoFields
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            slug={slug}
            allowIndexing={allowIndexing}
            autoSlug={autoSlug}
            onChange={handleFieldChange}
          />

          {/* Phase 1 — Taxonomy & Focus Keyword */}
          <TagCategoryFields
            focusKeyword={focusKeyword}
            category={category}
            tags={tags}
            onChange={handleFieldChange}
          />

          {/* Phase 3 — Social / OG */}
          <SocialFields
            ogTitle={ogTitle}
            ogDescription={ogDescription}
            ogImage={ogImage}
            canonicalUrl={canonicalUrl}
            onChange={handleFieldChange}
          />

          {/* Phase 4 — Schema Markup */}
          <SchemaMarkupFields
            articleType={articleType}
            schemaFaqItems={schemaFaqItems}
            schemaHowToSteps={schemaHowToSteps}
            onChange={handleFieldChange}
          />
        </Grid>

        {/* ── RIGHT COLUMN ── */}
        <Grid size={{ xs: 12, lg: 4 }}>

          {/* Publish Actions */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e5eaef',
              mb: 4,
              backgroundColor: '#ffffff',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0 }}>
                Post Attributes
              </Typography>
              {/* Auto-save status indicator */}
              <Fade in={autoSaveStatus !== 'idle'} timeout={600}>
                <Box>
                  {autoSaveStatus === 'saving' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <CircularProgress size={12} thickness={6} color="inherit" sx={{ color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Saving…
                      </Typography>
                    </Box>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                      ✓ Saved at {lastSavedAt ? lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </Typography>
                  )}
                  {autoSaveStatus === 'error' && (
                    <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                      ⚠ Auto-save failed
                    </Typography>
                  )}
                </Box>
              </Fade>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', gap: 1, mb: 1 }}
              >
                Status:{' '}
                <strong
                  style={{
                    textTransform: 'uppercase',
                    color: status === 'published' ? '#17C653' : '#7C8FAC',
                  }}
                >
                  {status}
                </strong>
              </Typography>
            </Box>

            <Stack spacing={2}>
              {canPublish && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={saving}
                  onClick={() => handleSave('published')}
                  startIcon={
                    saving ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <IconDeviceFloppy size={18} />
                    )
                  }
                  sx={{ py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  {status === 'published' ? 'Update Post' : 'Publish Live'}
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                disabled={saving}
                onClick={() => handleSave('draft')}
                sx={{ py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                {status === 'published' ? 'Revert to Draft' : 'Save as Draft'}
              </Button>
            </Stack>
          </Paper>

          {/* Featured Image */}
          <FeaturedImageUpload
            image={featuredImage}
            alt={featuredImageAlt}
            onImageChange={setFeaturedImage}
            onAltChange={setFeaturedImageAlt}
          />

          {/* Phase 2 — Live SEO Score */}
          <SeoScorePanel
            title={title}
            slug={slug}
            excerpt={excerpt}
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            focusKeyword={focusKeyword}
            featuredImage={featuredImage}
            featuredImageAlt={featuredImageAlt}
            content={content}
            allowIndexing={allowIndexing}
          />

          {/* Live TOC Preview */}
          <TocPreview content={content} />

          {/* Excerpt */}
          <Paper
            elevation={1}
            sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaef', mb: 4 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Article Excerpt
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Write a brief excerpt summarizing this blog post. Used in listings page grid..."
              variant="outlined"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              helperText="If left empty, a short summary is auto-extracted from your first text block."
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Navigation Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1, border: '1px solid #e2e8f0' }
          }
        }}
      >
        <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 700, pb: 1 }}>
          Unsaved Changes Detected
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description" sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
            You have unsaved changes in this blog post. Would you like to save them as a draft before navigating away?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button 
            onClick={handleDiscardAndLeave} 
            color="error" 
            variant="outlined" 
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Discard & Leave
          </Button>
          <Button 
            onClick={handleSaveAndLeave} 
            color="primary" 
            variant="contained" 
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Save Draft & Leave
          </Button>
          <Button 
            onClick={() => setConfirmDialogOpen(false)} 
            color="inherit" 
            variant="text" 
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 500 }}
          >
            Keep Editing
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
