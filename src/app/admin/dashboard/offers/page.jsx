'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Paper, Button, TextField, Switch, FormControlLabel,
  Snackbar, Alert, CircularProgress, Tabs, Tab, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Divider, Grid, Chip,
} from '@mui/material';
import {
  IconDeviceFloppy, IconRefresh, IconPlus, IconTrash, IconPencil,
  IconGift, IconCloudUpload, IconPhoto,
} from '@tabler/icons-react';
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

const EMPTY_OFFER = {
  id: '',
  enabled: true,
  image: '',
  tagline: 'Download',
  heading: '',
  downloadButtonText: 'DOWNLOAD NOW!',
  downloadUrl: '',
  text: '',
  validUntil: '',
  validUntilLabel: 'Valid til:',
  showDownloadButton: true,
  sortOrder: 0,
};

export default function AdminOffersPage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  const [uploading, setUploading] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/offers', { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setConfig(data);
      else showSnackbar(data.error || 'Failed to load offers config', 'error');
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!can('offers.manage')) router.replace('/admin/dashboard');
  }, [router]);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok) {
        setConfig(data);
        showSnackbar('Offers settings saved');
      } else {
        showSnackbar(data.error || 'Failed to save', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updatePopup = (field, value) => {
    setConfig((prev) => ({ ...prev, popup: { ...prev.popup, [field]: value } }));
  };

  const updatePage = (field, value) => {
    setConfig((prev) => ({ ...prev, page: { ...prev.page, [field]: value } }));
  };

  const openNewOffer = () => {
    setEditOffer({ ...EMPTY_OFFER, id: `offer-${Date.now()}`, sortOrder: config?.offers?.length || 0 });
    setEditIndex(-1);
  };

  const openEditOffer = (offer, index) => {
    setEditOffer({ ...offer });
    setEditIndex(index);
  };

  const saveOffer = () => {
    if (!editOffer?.heading?.trim()) {
      showSnackbar('Heading is required', 'error');
      return;
    }
    setConfig((prev) => {
      const offers = [...(prev.offers || [])];
      const payload = {
        ...editOffer,
        id: editOffer.id || `offer-${Date.now()}`,
        heading: editOffer.heading.trim(),
        text: editOffer.text.trim(),
      };
      if (editIndex >= 0) offers[editIndex] = payload;
      else offers.push(payload);
      return { ...prev, offers };
    });
    setEditOffer(null);
    setEditIndex(-1);
  };

  const deleteOffer = (index) => {
    setConfig((prev) => ({
      ...prev,
      offers: prev.offers.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editOffer) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setEditOffer((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !config) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Offers</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage the offers page listings, site popup, and mini banner content.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<IconRefresh size={16} />} onClick={fetchConfig} sx={{ textTransform: 'none', borderRadius: 2 }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size={16} />} onClick={handleSave} disabled={saving} sx={{ textTransform: 'none', borderRadius: 2 }}>
            Save All
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: '1px solid #e5eaef' }}>
          <Tab label="Offer Listings" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Popup & Banner" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Offers Page" sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Active offer cards on /offers</Typography>
                <Button startIcon={<IconPlus size={16} />} onClick={openNewOffer} sx={{ textTransform: 'none', borderRadius: 2 }}>
                  Add Offer
                </Button>
              </Box>

              {!config.offers?.length ? (
                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '2px dashed #e5eaef', borderRadius: 2 }}>
                  <IconGift size={36} stroke={1.2} style={{ opacity: 0.35, marginBottom: 8 }} />
                  <Typography color="text.secondary">No offers yet. Add your first offer card.</Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {config.offers.map((offer, index) => (
                    <Paper key={offer.id || index} elevation={0} sx={{ p: 2, border: '1px solid #e5eaef', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      {offer.image && (
                        <Box component="img" src={offer.image} alt="" sx={{ width: 56, height: 72, objectFit: 'contain', borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid #e5eaef' }} />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700 }}>{offer.text || offer.heading}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>{offer.heading}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                          {offer.validUntil && <Chip label={`Valid til ${offer.validUntil}`} size="small" />}
                          <Chip label={offer.enabled ? 'Enabled' : 'Disabled'} size="small" color={offer.enabled ? 'success' : 'default'} />
                        </Box>
                      </Box>
                      <IconButton onClick={() => openEditOffer(offer, index)}><IconPencil size={16} /></IconButton>
                      <IconButton color="error" onClick={() => deleteOffer(index)}><IconTrash size={16} /></IconButton>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {tab === 1 && (
            <Grid container spacing={2.5}>
              <Grid size={12}>
                <FormControlLabel
                  control={<Switch checked={config.popup.enabled} onChange={(e) => updatePopup('enabled', e.target.checked)} />}
                  label="Enable site-wide offer popup & mini banner"
                />
              </Grid>
              {[
                ['badgeText', 'Badge Text', 'Limited Time Offer'],
                ['headline', 'Headline (before accent)', 'Get'],
                ['headlineAccent', 'Headline Accent (red text)', '₹3,000 OFF'],
                ['subtitle', 'Subtitle', 'on Your Digital Marketing Course'],
                ['description', 'Description', 'Use code at enquiry — seats are limited!'],
                ['offerCode', 'Offer Code', 'OFFER-2026'],
                ['ctaText', 'WhatsApp Button Text', 'Claim Offer on WhatsApp'],
                ['secondaryCtaText', 'Secondary Button Text', 'Not Now'],
                ['footerText', 'Footer Note', 'No spam · Code sent instantly via WhatsApp'],
                ['whatsappPhone', 'WhatsApp Phone (with country code)', '917558888252'],
                ['miniBannerText', 'Mini Banner Text (desktop)', 'Exclusive Offer Expiring Soon!'],
                ['miniBannerTextMobile', 'Mini Banner Text (mobile)', 'Offer Expiring Soon!'],
                ['miniBannerCta', 'Mini Banner Button', 'CLAIM'],
              ].map(([field, label, placeholder]) => (
                <Grid size={{ xs: 12, md: 6 }} key={field}>
                  <TextField fullWidth label={label} value={config.popup[field] || ''} onChange={(e) => updatePopup(field, e.target.value)} placeholder={placeholder} />
                </Grid>
              ))}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth type="number" label="Popup Delay (seconds)" value={config.popup.delaySeconds} onChange={(e) => updatePopup('delaySeconds', Number(e.target.value))} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth type="number" label="Countdown Duration (minutes)" value={config.popup.durationMinutes} onChange={(e) => updatePopup('durationMinutes', Number(e.target.value))} />
              </Grid>
            </Grid>
          )}

          {tab === 2 && (
            <Grid container spacing={2.5}>
              {[
                ['heroTagline', 'Hero Tagline', 'Exclusive Downloads'],
                ['title', 'Page Title', 'Offers & Free Resources'],
                ['subtitle', 'Page Subtitle', 'Download handbooks, guides, and exclusive resources from Zeon Academy.'],
              ].map(([field, label, placeholder]) => (
                <Grid size={12} key={field}>
                  <TextField fullWidth label={label} value={config.page[field] || ''} onChange={(e) => updatePage(field, e.target.value)} placeholder={placeholder} multiline={field === 'subtitle'} rows={field === 'subtitle' ? 2 : 1} />
                </Grid>
              ))}
              <Grid size={12}>
                <Typography variant="caption" color="text.secondary">
                  SEO for /offers can be customized under Admin → Pages.
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>

      <Dialog
        open={Boolean(editOffer)}
        onClose={() => setEditOffer(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        {editOffer && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>{editIndex >= 0 ? 'Edit Offer' : 'Add Offer'}</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel control={<Switch checked={editOffer.enabled} onChange={(e) => setEditOffer((p) => ({ ...p, enabled: e.target.checked }))} />} label="Enabled" />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Card Image</Typography>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                  {editOffer.image ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Box component="img" src={editOffer.image} alt="" sx={{ width: 80, height: 100, objectFit: 'contain', border: '1px solid #e5eaef', borderRadius: 1 }} />
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button size="small" startIcon={<IconPhoto size={14} />} onClick={() => setMediaPickerOpen(true)} sx={{ textTransform: 'none' }}>
                          Media Library
                        </Button>
                        <Button size="small" onClick={() => fileInputRef.current?.click()} disabled={uploading}>{uploading ? 'Uploading…' : 'Upload New'}</Button>
                        <Button size="small" color="error" onClick={() => setEditOffer((p) => ({ ...p, image: '' }))}>Remove</Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button variant="outlined" startIcon={uploading ? <CircularProgress size={14} /> : <IconCloudUpload size={16} />} onClick={() => fileInputRef.current?.click()} disabled={uploading} sx={{ textTransform: 'none' }}>
                        Upload Image
                      </Button>
                      <Button variant="outlined" startIcon={<IconPhoto size={16} />} onClick={() => setMediaPickerOpen(true)} sx={{ textTransform: 'none' }}>
                        Choose from Media Library
                      </Button>
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, lineHeight: 1.5 }}>
                    Recommended: 1200 × 600 px (2:1 landscape), PNG or WebP. Image covers the top banner only — keep text on the left and visuals on the right.
                  </Typography>
                </Box>

                <TextField label="Tagline" value={editOffer.tagline} onChange={(e) => setEditOffer((p) => ({ ...p, tagline: e.target.value }))} placeholder="Download" />
                <TextField label="Heading" required value={editOffer.heading} onChange={(e) => setEditOffer((p) => ({ ...p, heading: e.target.value }))} placeholder="Free Handbook" helperText="Use line breaks for multi-line headings if needed" multiline rows={2} />
                <FormControlLabel
                  control={<Switch checked={editOffer.showDownloadButton !== false} onChange={(e) => setEditOffer((p) => ({ ...p, showDownloadButton: e.target.checked }))} />}
                  label="Show download button"
                />
                {editOffer.showDownloadButton !== false && (
                  <TextField
                    label="Button Text"
                    value={editOffer.downloadButtonText ?? ''}
                    onChange={(e) => setEditOffer((p) => ({ ...p, downloadButtonText: e.target.value }))}
                    placeholder="DOWNLOAD NOW!"
                    helperText="Text on the black CTA pill. Used for download and contact links."
                  />
                )}
                <TextField label="Download URL" value={editOffer.downloadUrl} onChange={(e) => setEditOffer((p) => ({ ...p, downloadUrl: e.target.value }))} placeholder="/brochures/handbook.pdf" helperText="PDF or file path. Leave empty to link to contact page." />
                <Divider />
                <TextField label="Card Title (below banner)" value={editOffer.text} onChange={(e) => setEditOffer((p) => ({ ...p, text: e.target.value }))} placeholder="Get Free Handbook" />
                <TextField label="Valid Until" type="date" value={editOffer.validUntil} onChange={(e) => setEditOffer((p) => ({ ...p, validUntil: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
                <TextField label="Valid Until Label" value={editOffer.validUntilLabel ?? ''} onChange={(e) => setEditOffer((p) => ({ ...p, validUntilLabel: e.target.value }))} placeholder="Valid til:" helperText="Text shown before the expiry date" />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setEditOffer(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
              <Button variant="contained" onClick={saveOffer} sx={{ textTransform: 'none' }}>Add to List</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <MediaPickerDialog
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedUrl={editOffer?.image || ''}
        title="Choose Offer Card Image"
        onSelect={(url) => setEditOffer((prev) => (prev ? { ...prev, image: url } : prev))}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
