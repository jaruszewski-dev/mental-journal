import {
  computeShadowBannedUntil,
  SHADOWBAN_DURATION_DAYS,
} from './trust-score.const';

describe('computeShadowBannedUntil', () => {
  it(`returns midnight Europe/Warsaw ${SHADOWBAN_DURATION_DAYS} calendar days ahead`, () => {
    const from = new Date('2026-08-26T14:30:00.000Z');
    const until = computeShadowBannedUntil(from);

    const warsawParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Warsaw',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(until);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
      warsawParts.find((part) => part.type === type)?.value;

    expect(get('year')).toBe('2026');
    expect(get('month')).toBe('08');
    expect(get('day')).toBe('29');
    expect(get('hour')).toBe('00');
    expect(get('minute')).toBe('00');
    expect(get('second')).toBe('00');
  });
});
