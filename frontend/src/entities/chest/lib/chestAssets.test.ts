import { describe, expect, it } from 'vitest';
import {
  chestClosedUrl,
  chestHasTapOpen,
  chestTapFrameUrls,
  chestTapsRequired,
} from './chestAssets';

describe('chestAssets', () => {
  it('common tap-open frames', () => {
    expect(chestHasTapOpen('COMMON')).toBe(true);
    expect(chestTapsRequired('COMMON')).toBe(4);
    const frames = chestTapFrameUrls('COMMON');
    expect(frames).toHaveLength(5);
    expect(frames?.[0]).toContain('chests/common/0.png');
    expect(chestClosedUrl('COMMON')).toBe(frames?.[0] ?? null);
  });

  it('rare tap-open frames', () => {
    expect(chestHasTapOpen('RARE')).toBe(true);
    expect(chestTapsRequired('RARE')).toBe(4);
    const frames = chestTapFrameUrls('RARE');
    expect(frames).toHaveLength(5);
    expect(frames?.[0]).toContain('chests/rare/1.png');
    expect(frames?.[4]).toContain('chests/rare/5.png');
    expect(chestClosedUrl('RARE')).toBe(frames?.[0] ?? null);
  });

  it('epic has no assets yet', () => {
    expect(chestHasTapOpen('EPIC')).toBe(false);
    expect(chestTapFrameUrls('EPIC')).toBeNull();
    expect(chestClosedUrl('EPIC')).toBeNull();
  });
});
