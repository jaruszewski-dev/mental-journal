import { faker } from '@faker-js/faker';
import { ALL_JOURNAL_TAGS } from '@repo/api-types';

const PROMPTS = [
	'Today felt heavier than usual, but I still showed up for myself.',
	'I noticed my breathing when the stress started climbing.',
	'A short walk helped me reset more than I expected.',
	'I am learning to pause before reacting to hard feelings.',
	'Gratitude for a small moment that made the evening softer.',
	'Work was loud in my head; journaling helps me put it down.',
	'I miss connection, and naming that already feels a bit lighter.',
	'Progress is uneven, and that is still progress.',
	'Dzisiaj było trudniej, ale nie odpuściłem małego kroku.',
	'Zauważyłem napięcie w ciele zanim myśli zdążyły mnie zalać.',
	'Krótka przerwa i herbata zrobiły więcej niż myślałem.',
	'Uczę się mówić o potrzebach bez poczucia winy.',
	'Jestem wdzięczny za spokojny wieczór bez pośpiechu.',
	'Czasem wystarczy zapisać myśl, żeby przestała krążyć.',
] as const;

export function fakeJournalContent(): string {
	const base = faker.helpers.arrayElement(PROMPTS);
	const extra = faker.lorem.sentences(faker.number.int({ min: 1, max: 3 }));
	return `${base} ${extra}`.slice(0, 4000);
}

export function fakeCommentContent(): string {
	const lines = [
		'Thanks for sharing this — you are not alone.',
		'Dzięki za szczerość. Trzymam kciuki.',
		'That takes courage to write out loud.',
		'Mały krok też się liczy.',
		'Sending calm your way.',
		'Rozumiem to uczucie. Oddychaj spokojnie.',
		'I hear you. One day at a time.',
		'Trzymam za Ciebie kciuki.',
	] as const;

	return faker.helpers.arrayElement(lines);
}

export function fakeTags(): string[] {
	const count = faker.number.int({ min: 0, max: 5 });
	if (count === 0) return [];
	return faker.helpers.arrayElements([...ALL_JOURNAL_TAGS], count);
}

export function fakeMood(): number | null {
	if (faker.datatype.boolean({ probability: 0.15 })) return null;
	return faker.number.int({ min: 1, max: 5 });
}
