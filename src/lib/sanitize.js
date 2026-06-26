import DOMPurify from 'isomorphic-dompurify';

export const ALLOWED_TAGS = [
  'p', 'h2', 'h3', 'h4', 'strong', 'em', 'a', 'ul', 'ol', 'li',
  'blockquote', 'code', 'br', 'img', 'span'
];

export const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'class'];

// Add hook to force all links to open in a new tab with proper security
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export function sanitizeHtml(dirtyHtml) {
  if (!dirtyHtml) return '';
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}
