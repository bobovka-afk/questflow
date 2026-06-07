/** Обёртка выделения в textarea (markdown). */
export function wrapTextareaSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder = 'текст',
): { value: string; selectionStart: number; selectionEnd: number } {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || placeholder;
  const value =
    textarea.value.slice(0, start) + before + selected + after + textarea.value.slice(end);
  const cursor = start + before.length + selected.length + after.length;
  return { value, selectionStart: cursor, selectionEnd: cursor };
}

export function insertTextareaAtCursor(
  textarea: HTMLTextAreaElement,
  insert: string,
): { value: string; selectionStart: number; selectionEnd: number } {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value.slice(0, start) + insert + textarea.value.slice(end);
  const cursor = start + insert.length;
  return { value, selectionStart: cursor, selectionEnd: cursor };
}

export function applyTextareaEdit(
  textarea: HTMLTextAreaElement,
  next: { value: string; selectionStart: number; selectionEnd: number },
  onChange: (v: string) => void,
) {
  onChange(next.value);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(next.selectionStart, next.selectionEnd);
  });
}

export function toggleBold(textarea: HTMLTextAreaElement, onChange: (v: string) => void) {
  applyTextareaEdit(textarea, wrapTextareaSelection(textarea, '**', '**'), onChange);
}

export function toggleItalic(textarea: HTMLTextAreaElement, onChange: (v: string) => void) {
  applyTextareaEdit(textarea, wrapTextareaSelection(textarea, '*', '*'), onChange);
}

export function insertLink(textarea: HTMLTextAreaElement, onChange: (v: string) => void) {
  const url = window.prompt('URL ссылки', 'https://');
  if (!url?.trim()) return;
  const label =
    textarea.value.slice(textarea.selectionStart, textarea.selectionEnd) || 'ссылка';
  applyTextareaEdit(
    textarea,
    insertTextareaAtCursor(textarea, `[${label}](${url.trim()})`),
    onChange,
  );
}

export function insertImageUrl(textarea: HTMLTextAreaElement, onChange: (v: string) => void) {
  const url = window.prompt('URL изображения', 'https://');
  if (!url?.trim()) return;
  const alt =
    textarea.value.slice(textarea.selectionStart, textarea.selectionEnd) || 'изображение';
  applyTextareaEdit(
    textarea,
    insertTextareaAtCursor(textarea, `\n![${alt}](${url.trim()})\n`),
    onChange,
  );
}

export function insertBulletList(textarea: HTMLTextAreaElement, onChange: (v: string) => void) {
  const start = textarea.selectionStart;
  const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;
  applyTextareaEdit(
    textarea,
    insertTextareaAtCursor(textarea, '- '),
    onChange,
  );
  void lineStart;
}

export function insertChecklist(textarea: HTMLTextAreaElement, onChange: (v: string) => void) {
  applyTextareaEdit(textarea, insertTextareaAtCursor(textarea, '- [ ] '), onChange);
}

export function insertHorizontalRule(
  textarea: HTMLTextAreaElement,
  onChange: (v: string) => void,
) {
  applyTextareaEdit(textarea, insertTextareaAtCursor(textarea, '\n---\n'), onChange);
}

const HEADING_CYCLE = ['### ', '## ', '# ', ''] as const;

export function cycleHeading(textarea: HTMLTextAreaElement, onChange: (v: string) => void) {
  const start = textarea.selectionStart;
  const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = textarea.value.indexOf('\n', start);
  const end = lineEnd === -1 ? textarea.value.length : lineEnd;
  const line = textarea.value.slice(lineStart, end);
  let nextPrefix: (typeof HEADING_CYCLE)[number] = HEADING_CYCLE[0];
  for (let i = 0; i < HEADING_CYCLE.length; i++) {
    const p = HEADING_CYCLE[i];
    if (p && line.startsWith(p)) {
      nextPrefix = HEADING_CYCLE[(i + 1) % HEADING_CYCLE.length];
      break;
    }
    if (!p && !HEADING_CYCLE.some((h) => h && line.startsWith(h))) {
      nextPrefix = HEADING_CYCLE[0];
      break;
    }
  }
  const stripped = line.replace(/^#{1,3}\s+/, '');
  const newLine = nextPrefix + stripped;
  const value =
    textarea.value.slice(0, lineStart) + newLine + textarea.value.slice(end);
  applyTextareaEdit(
    textarea,
    {
      value,
      selectionStart: lineStart + newLine.length,
      selectionEnd: lineStart + newLine.length,
    },
    onChange,
  );
}

export function attachmentMarkdown(row: {
  fileName: string;
  url: string;
  isImage: boolean;
}): string {
  if (row.isImage) return `\n![${row.fileName}](${row.url})\n`;
  return `\n[📎 ${row.fileName}](${row.url})\n`;
}
