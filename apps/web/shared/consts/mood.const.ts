export const MOODS = [
	{ value: 1, emoji: '😞' },
	{ value: 2, emoji: '😕' },
	{ value: 3, emoji: '😐' },
	{ value: 4, emoji: '🙂' },
	{ value: 5, emoji: '😊' },
] as const;

export const MOOD_EMOJI: Record<number, string> = Object.fromEntries(
	MOODS.map(({ value, emoji }) => [value, emoji]),
);
