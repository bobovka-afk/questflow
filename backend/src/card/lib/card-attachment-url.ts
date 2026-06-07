export function isVideoLinkUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./i, '').toLowerCase();
    return (
      host === 'youtu.be' ||
      host.endsWith('youtube.com') ||
      host.endsWith('vimeo.com') ||
      host.endsWith('twitch.tv')
    );
  } catch {
    return false;
  }
}

export function linkDisplayName(url: string, fileName?: string): string {
  if (fileName?.trim()) return fileName.trim().slice(0, 200);
  try {
    const u = new URL(url);
    if (isVideoLinkUrl(url)) {
      return u.hostname.replace(/^www\./i, '');
    }
    const path = u.pathname.split('/').filter(Boolean).pop();
    return path || u.hostname;
  } catch {
    return url.slice(0, 200);
  }
}
