'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { IconCircleCheck, IconCircleX, IconCircleMinus } from '@tabler/icons-react';

// Strip HTML tags from rich text block content
function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Count words across all text blocks
function countWords(content = []) {
  const text = content
    .filter((b) => b.type === 'text')
    .map((b) => stripHtml(b.html || ''))
    .join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

// Get the first text block's plain text
function getFirstParagraph(content = []) {
  const first = content.find((b) => b.type === 'text');
  return first ? stripHtml(first.html || '').toLowerCase() : '';
}

// Parse HTML contents to check for internal/external links
function checkLinks(content = []) {
  let hasInternal = false;
  let hasExternal = false;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://admission.zeonacademy.com';

  content
    .filter((b) => b.type === 'text' && b.html)
    .forEach((b) => {
      // Fast RegExp matches for link URLs
      const matches = [...b.html.matchAll(/href="([^"]+)"/g)];
      matches.forEach((match) => {
        const url = match[1];
        if (
          url.startsWith('/') ||
          url.startsWith('#') ||
          url.startsWith(siteUrl) ||
          url.startsWith('https://zeon') ||
          url.startsWith('http://localhost')
        ) {
          hasInternal = true;
        } else if (url.startsWith('http://') || url.startsWith('https://')) {
          hasExternal = true;
        }
      });
    });

  return { hasInternal, hasExternal };
}

export default function SeoScorePanel({
  title = '',
  slug = '',
  excerpt = '',
  seoTitle = '',
  seoDescription = '',
  focusKeyword = '',
  featuredImage = null,
  featuredImageAlt = '',
  content = [],
  allowIndexing = true,
}) {
  const kw = focusKeyword.toLowerCase().trim();
  const hasKeyword = kw.length > 0;
  const kwSlug = kw.replace(/\s+/g, '-');

  const checks = useMemo(() => {
    const titleLen = seoTitle.length;
    const descLen = seoDescription.length;
    const wordCount = countWords(content);
    const firstPara = getFirstParagraph(content);
    const { hasInternal, hasExternal } = checkLinks(content);

    return [
      // — Keyword checks (marked N/A when no keyword) —
      {
        label: 'Focus keyword in SEO Title',
        pass: hasKeyword ? seoTitle.toLowerCase().includes(kw) : null,
      },
      {
        label: 'Focus keyword in URL slug',
        pass: hasKeyword ? slug.includes(kwSlug) : null,
      },
      {
        label: 'Focus keyword in Meta Description',
        pass: hasKeyword ? seoDescription.toLowerCase().includes(kw) : null,
      },
      {
        label: 'Focus keyword in first paragraph',
        pass: hasKeyword ? firstPara.includes(kw) : null,
      },
      // — Non-keyword checks —
      {
        label: `SEO Title length (${titleLen} chars, ideal 50–60)`,
        pass: titleLen >= 50 && titleLen <= 60,
      },
      {
        label: `Meta Description length (${descLen} chars, ideal 120–160)`,
        pass: descLen >= 120 && descLen <= 160,
      },
      {
        label: 'Featured image uploaded',
        pass: !!featuredImage,
      },
      {
        label: 'Featured image has alt text',
        pass: !!featuredImageAlt && featuredImageAlt.trim().length > 0,
      },
      {
        label: 'Indexing enabled (robots: index)',
        pass: allowIndexing === true,
      },
      {
        label: `Content length (${wordCount} words, min 1200)`,
        pass: wordCount >= 1200,
      },
      {
        label: 'At least one internal link included',
        pass: hasInternal,
      },
      {
        label: 'At least one external link included',
        pass: hasExternal,
      },
    ];
  }, [
    kw, kwSlug, hasKeyword, seoTitle, seoDescription, slug,
    content, featuredImage, featuredImageAlt, allowIndexing,
  ]);

  // Score: only count non-null checks
  const scoreable = checks.filter((c) => c.pass !== null);
  const passed = scoreable.filter((c) => c.pass === true).length;
  const score = scoreable.length > 0 ? Math.round((passed / scoreable.length) * 100) : 0;

  const scoreColor =
    score >= 80 ? '#17C653' : score >= 50 ? '#f59e0b' : '#ef4444';

  // SVG circular progress
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference - (score / 100) * circumference;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid #e5eaef',
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        SEO Score
      </Typography>

      {/* Score Ring */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.5 }}>
        <Box sx={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            {/* Track */}
            <circle
              cx="45" cy="45" r={radius}
              fill="none"
              stroke="#e5eaef"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="45" cy="45" r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              transform="rotate(-90 45 45)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <Box
            sx={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: scoreColor }}>
              {score}%
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: scoreColor }}>
            {score >= 80 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Poor'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {passed}/{scoreable.length} checks passed
            {!hasKeyword && ' (keyword checks skipped)'}
          </Typography>
        </Box>
      </Box>

      {/* Checklist */}
      <List dense disablePadding>
        {checks.map((check, i) => {
          const isNA = check.pass === null;
          const icon = isNA ? (
            <IconCircleMinus size={16} color="#94a3b8" />
          ) : check.pass ? (
            <IconCircleCheck size={16} color="#17C653" />
          ) : (
            <IconCircleX size={16} color="#ef4444" />
          );

          return (
            <ListItem key={i} disableGutters sx={{ py: 0.3, display: 'flex', alignItems: 'center' }}>
              <ListItemIcon sx={{ minWidth: 28, display: 'flex', alignItems: 'center' }}>{icon}</ListItemIcon>
              <Typography
                variant="caption"
                sx={{
                  color: isNA ? 'text.disabled' : check.pass ? 'text.primary' : 'error.main',
                  fontWeight: isNA ? 400 : 500,
                }}
              >
                {check.label}
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
