const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function formatFeedTime(
  createdAt: string | Date,
  locale: string,
  now: Date = new Date(),
): string {
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const diffMs = Math.max(0, now.getTime() - date.getTime());

  if (diffMs < MINUTE_MS) {
    return locale.startsWith("pl") ? "teraz" : "now";
  }

  if (diffMs < HOUR_MS) {
    return `${Math.floor(diffMs / MINUTE_MS)}m`;
  }

  if (diffMs < DAY_MS) {
    return `${Math.floor(diffMs / HOUR_MS)}h`;
  }

  const sameYear = date.getFullYear() === now.getFullYear();

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date);
}
