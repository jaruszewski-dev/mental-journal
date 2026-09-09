export function formatJournalDayLabel(createdAt: string | Date, locale: string, now: Date = new Date()): string {
	const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const diffDays = Math.round((startOfToday.getTime() - startOfDate.getTime()) / (24 * 60 * 60 * 1000));

	if (diffDays === 0) {
		return locale.startsWith('pl') ? 'Dziś' : 'Today';
	}
	if (diffDays === 1) {
		return locale.startsWith('pl') ? 'Wczoraj' : 'Yesterday';
	}

	const sameYear = date.getFullYear() === now.getFullYear();
	return new Intl.DateTimeFormat(locale, {
		day: 'numeric',
		month: 'long',
		...(sameYear ? {} : { year: 'numeric' }),
	}).format(date);
}

export function journalDayKey(createdAt: string | Date): string {
	const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}
