import { describe, expect, it } from 'vitest';
import { formatClientIpForDisplay } from './formatClientIp';

describe('formatClientIpForDisplay', () => {
  it('strips IPv6-mapped prefix', () => {
    expect(formatClientIpForDisplay('::ffff:172.23.0.1')).toBeNull();
  });

  it('hides loopback', () => {
    expect(formatClientIpForDisplay('::1')).toBeNull();
    expect(formatClientIpForDisplay('127.0.0.1')).toBeNull();
  });

  it('keeps public IPv4', () => {
    expect(formatClientIpForDisplay('203.0.113.8')).toBe('203.0.113.8');
  });

  it('handles empty', () => {
    expect(formatClientIpForDisplay(null)).toBeNull();
    expect(formatClientIpForDisplay('')).toBeNull();
  });
});
