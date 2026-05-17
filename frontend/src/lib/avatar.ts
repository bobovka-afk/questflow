import { API_URL } from './api';
import { navigate } from './navigation';

export function avatarSrcFromPath(p: string | null | undefined): string {
  if (!p) return '';
  const normalized = p.replace(/\\/g, '/');
  if (normalized.startsWith('data:')) return normalized;
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized;
  if (normalized.startsWith('//')) {
    const proto = API_URL.startsWith('https://') ? 'https:' : 'http:';
    return `${proto}${normalized}`;
  }
  if (normalized.startsWith('/')) return `${API_URL}${normalized}`;
  return `${API_URL}/${normalized}`;
}

export function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase();
  const n = name.trim();
  return n.slice(0, 2).toUpperCase() || '?';
}

export function userProfilePath(userId: number): string {
  return `/profile/user/${userId}`;
}

export function userCharacterPath(userId: number): string {
  return `/profile/user/${userId}/character`;
}

export function openUserProfile(userId: number, currentUserId: number | null | undefined) {
  if (currentUserId != null && userId === currentUserId) {
    navigate('/profile/me');
    return;
  }
  navigate(userProfilePath(userId));
}
