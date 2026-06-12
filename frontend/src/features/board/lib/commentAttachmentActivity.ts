const MARKDOWN_LINK_URL_RE = /!?\[[^\]]*\]\(([^)]+)\)/g;
const MARKDOWN_IMAGE_NAME_RE = /!\[([^\]]*)\]\([^)]+\)/g;
const MARKDOWN_FILE_NAME_RE = /\[📎\s*([^\]]*)\]\([^)]+\)/g;

function normalizeUrlForCompare(url: string): string {
  const trimmed = url.trim();
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      return decodeURIComponent(new URL(trimmed).pathname);
    }
  } catch {
    /* ignore */
  }
  const noQuery = trimmed.split('?')[0] ?? trimmed;
  try {
    return decodeURIComponent(noQuery);
  } catch {
    return noQuery;
  }
}

function uploadPathKey(url: string): string | null {
  const path = normalizeUrlForCompare(url);
  const uploadsIdx = path.indexOf('/uploads/');
  if (uploadsIdx >= 0) return path.slice(uploadsIdx);
  const cardIdx = path.indexOf('card-attachments/');
  if (cardIdx >= 0) return path.slice(cardIdx);
  return path || null;
}

function markdownUrlsInBodies(comments: { body: string }[]): Set<string> {
  const keys = new Set<string>();
  for (const { body } of comments) {
    for (const match of body.matchAll(MARKDOWN_LINK_URL_RE)) {
      const raw = match[1]?.trim();
      if (!raw) continue;
      keys.add(normalizeUrlForCompare(raw));
      const pathKey = uploadPathKey(raw);
      if (pathKey) keys.add(pathKey);
    }
  }
  return keys;
}

function markdownFileNamesInBodies(comments: { body: string }[]): Set<string> {
  const names = new Set<string>();
  for (const { body } of comments) {
    for (const match of body.matchAll(MARKDOWN_IMAGE_NAME_RE)) {
      const name = match[1]?.trim();
      if (name) names.add(name);
    }
    for (const match of body.matchAll(MARKDOWN_FILE_NAME_RE)) {
      const name = match[1]?.trim();
      if (name) names.add(name);
    }
  }
  return names;
}

function attachmentUrlKeys(url: string): string[] {
  const keys = [normalizeUrlForCompare(url)];
  const pathKey = uploadPathKey(url);
  if (pathKey) keys.push(pathKey);
  return keys;
}

function urlsMatchCommentMarkdown(
  attachmentUrls: string[],
  markdownUrlKeys: Set<string>,
): boolean {
  return attachmentUrls.some((url) =>
    attachmentUrlKeys(url).some((key) => markdownUrlKeys.has(key)),
  );
}

/** Attachment ids embedded in comment markdown (![](url) or [📎 …](url)). */
export function attachmentIdsEmbeddedInComments(
  attachments: {
    id: number;
    fileName: string;
    url: string;
    previewUrl?: string | null;
  }[],
  comments: { body: string }[],
): Set<number> {
  if (attachments.length === 0) return new Set();

  const markdownUrlKeys = markdownUrlsInBodies(comments);
  const markdownFileNames = markdownFileNamesInBodies(comments);
  const bodies = comments.map((c) => c.body).join('\n');
  const embedded = new Set<number>();

  for (const att of attachments) {
    const attachmentUrls = [att.url, att.previewUrl].filter(
      (url): url is string => Boolean(url),
    );

    if (urlsMatchCommentMarkdown(attachmentUrls, markdownUrlKeys)) {
      embedded.add(att.id);
      continue;
    }

    if (markdownFileNames.has(att.fileName)) {
      embedded.add(att.id);
      continue;
    }

    if (attachmentUrls.some((url) => bodies.includes(url))) {
      embedded.add(att.id);
    }
  }

  return embedded;
}
