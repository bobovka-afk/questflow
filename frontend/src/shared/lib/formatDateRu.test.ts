import { describe, expect, it } from 'vitest';
import {
  formatDateRuLong,
  formatDateTimeRu,
  formatDateTimeRuInTimeZone,
  formatDateTimeRuWithYear,
  formatRegisteredRu,
} from './formatDateRu';

describe('formatDateRu', () => {
  it('formats compact datetime without dots or commas', () => {
    expect(formatDateTimeRu('2026-06-07T22:09:00.000Z')).toMatch(/^\d{1,2} июн \d{2}:\d{2}$/);
    expect(formatDateTimeRu('2026-06-07T22:09:00.000Z')).not.toContain(',');
    expect(formatDateTimeRu('2026-06-07T22:09:00.000Z')).not.toContain('июн.');
  });

  it('formats datetime with year', () => {
    expect(formatDateTimeRuWithYear('2026-06-07T22:09:00.000Z')).toMatch(
      /^\d{1,2} июн 2026 \d{2}:\d{2}$/,
    );
  });

  it('formats long date for tables', () => {
    expect(formatDateRuLong('2026-06-07T22:09:00.000Z')).toMatch(
      /^\d{1,2} июня 2026 \d{2}:\d{2}$/,
    );
  });

  it('formats registration date', () => {
    expect(formatRegisteredRu('2026-06-07T22:09:00.000Z')).toMatch(/^\d{1,2} июня 2026$/);
  });

  it('formats datetime in timezone', () => {
    const label = formatDateTimeRuInTimeZone('2026-06-07T21:09:00.000Z', 'Europe/Moscow');
    expect(label).toMatch(/^\d{1,2} июн \d{2}:\d{2}$/);
    expect(label).not.toContain(',');
  });
});
