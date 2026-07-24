import sanitizeHtml from 'sanitize-html';

// Allow-list limited to what the Tiptap editor can emit. Anything else
// (script, iframe, event handlers, javascript: urls) is stripped. Used on
// WRITE so stored post content is always safe before it reaches
// dangerouslySetInnerHTML on the public site.
const OPTIONS = {
  allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    // Force safe rel on any anchors that survive.
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }, true),
  },
};

export function sanitizeRichText(html) {
  if (!html) return html;
  return sanitizeHtml(String(html), OPTIONS);
}

// True only if a URL is a safe http(s) link or a site-relative path.
export function isSafeUrl(url) {
  if (!url) return true; // empty is allowed (optional fields)
  const u = String(url).trim();
  if (u.startsWith('/')) return true; // local path
  return /^https?:\/\//i.test(u);
}
