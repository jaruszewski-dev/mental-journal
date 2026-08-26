export const TRUST_SCORE_ALLOW_DELTA = 1;

export const TRUST_SCORE_BLOCK_DELTA = -10;

export const TRUST_SCORE_SHADOWBAN_THRESHOLD = -50;

export const SHADOWBAN_DURATION_DAYS = 3;

const WARSAW_TIME_ZONE = 'Europe/Warsaw';

export function computeShadowBannedUntil(from: Date = new Date()): Date {
  const { year, month, day } = getZonedYmd(from, WARSAW_TIME_ZONE);
  const target = addCalendarDays(year, month, day, SHADOWBAN_DURATION_DAYS);
  return zonedMidnightToUtc(
    target.year,
    target.month,
    target.day,
    WARSAW_TIME_ZONE,
  );
}

function getZonedYmd(
  date: Date,
  timeZone: string,
): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return { year: get('year'), month: get('month'), day: get('day') };
}

function addCalendarDays(
  year: number,
  month: number,
  day: number,
  days: number,
): { year: number; month: number; day: number } {
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
  };
}

function zonedMidnightToUtc(
  year: number,
  month: number,
  day: number,
  timeZone: string,
): Date {
  let utcMs = Date.UTC(year, month - 1, day, 0, 0, 0);

  for (let i = 0; i < 2; i += 1) {
    const offsetMs = getTimeZoneOffsetMs(new Date(utcMs), timeZone);
    utcMs = Date.UTC(year, month - 1, day, 0, 0, 0) - offsetMs;
  }

  return new Date(utcMs);
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );

  return asUtc - date.getTime();
}
