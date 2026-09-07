const ADJECTIVES = [
	'Quiet',
	'Calm',
	'Brave',
	'Soft',
	'Swift',
	'Kind',
	'Clear',
	'Warm',
	'Silent',
	'Gentle',
	'Bright',
	'Steady',
	'Open',
	'Honest',
	'Lucky',
	'Mellow',
	'Clever',
	'Humble',
	'Curious',
	'Peaceful',
] as const;

const NOUNS = [
	'River',
	'Wind',
	'Stone',
	'Forest',
	'Cloud',
	'Harbor',
	'Path',
	'Light',
	'Echo',
	'Bloom',
	'Wave',
	'Oak',
	'Star',
	'Dawn',
	'Trail',
	'Meadow',
	'Cove',
	'Ridge',
	'Brook',
	'Sky',
] as const;

export function makeAnonName(index: number): string {
	const adjective = ADJECTIVES[index % ADJECTIVES.length]!;
	const noun = NOUNS[Math.floor(index / ADJECTIVES.length) % NOUNS.length]!;
	const suffix = String(index + 1).padStart(2, '0');
	const name = `${adjective}${noun}${suffix}`;
	return name.slice(0, 24);
}
