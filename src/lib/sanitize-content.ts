import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes CMS-authored article HTML before it is rendered on the public site.
 * Removes scripts, event handlers and unsafe URL schemes.
 */
function normalizeClassName(attribs: sanitizeHtml.Attributes): sanitizeHtml.Attributes {
  const { classname, ...rest } = attribs;
  if (classname && !rest.class) rest.class = classname;
  return rest;
}

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html || "", {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img", "h1", "h2", "h3", "h4", "figure", "figcaption", "u", "s", "mark", "hr", "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      // Accept JSX-style `className` (parsed as lowercase "classname") as a normal `class`
      "*": (tagName, attribs) => ({ tagName, attribs: normalizeClassName(attribs) }),
      a: (tagName, attribs) => {
        const next = normalizeClassName(attribs);
        return {
          tagName,
          attribs: next.target === "_blank" ? { ...next, rel: "noopener noreferrer" } : next,
        };
      },
    },
  });
}
