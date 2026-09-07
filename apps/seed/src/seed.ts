import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

import {
	CommentStatus,
	PostStatus,
	PreferredLocale,
	UserRole,
	UserStatus,
} from '../../api/src/generated/prisma/enums';
import {
	BCRYPT_SALT_ROUNDS,
	COMMENTS_PER_ACTIVE_POST_MAX,
	COMMENTS_PER_ACTIVE_POST_MIN,
	ENTRIES_PER_USER_MAX,
	ENTRIES_PER_USER_MIN,
	PUBLISH_RATIO,
	SEED_PASSWORD,
	SEED_USER_COUNT,
} from './consts';
import type { SeedPrisma } from './db';
import { makeAnonName } from './helpers/anon-name';
import {
	fakeCommentContent,
	fakeJournalContent,
	fakeMood,
	fakeTags,
} from './helpers/content';

function pickPostStatus(): (typeof PostStatus)[keyof typeof PostStatus] {
	const roll = faker.number.float({ min: 0, max: 1 });
	if (roll < 0.85) return PostStatus.ACTIVE;
	if (roll < 0.95) return PostStatus.PENDING;
	return PostStatus.HIDDEN;
}

function pickCommentStatus(): (typeof CommentStatus)[keyof typeof CommentStatus] {
	const roll = faker.number.float({ min: 0, max: 1 });
	if (roll < 0.9) return CommentStatus.ACTIVE;
	if (roll < 0.97) return CommentStatus.PENDING;
	return CommentStatus.HIDDEN;
}

export async function seedDatabase(prisma: SeedPrisma): Promise<void> {
	const passwordHash = await bcrypt.hash(SEED_PASSWORD, BCRYPT_SALT_ROUNDS);

	console.log(`Creating ${SEED_USER_COUNT} users…`);
	await prisma.user.createMany({
		data: Array.from({ length: SEED_USER_COUNT }, (_, index) => ({
			email: `seed.user.${index + 1}@example.com`,
			anonName: makeAnonName(index),
			passwordHash,
			emailVerified: true,
			status: UserStatus.ACTIVE,
			role: UserRole.USER,
			preferredLocale: index % 2 === 0 ? PreferredLocale.pl : PreferredLocale.en,
			trustScore: faker.number.int({ min: 0, max: 20 }),
		})),
		skipDuplicates: true,
	});

	const users = await prisma.user.findMany({
		where: { email: { startsWith: 'seed.user.' } },
		select: { id: true },
		orderBy: { email: 'asc' },
	});

	if (users.length === 0) {
		throw new Error('No seed users found after createMany');
	}

	console.log(`Creating journal entries for ${users.length} users…`);
	const entryRows: Array<{
		id: string;
		userId: string;
		content: string;
		mood: number | null;
		tags: string[];
		createdAt: Date;
	}> = [];

	for (const user of users) {
		const entryCount = faker.number.int({
			min: ENTRIES_PER_USER_MIN,
			max: ENTRIES_PER_USER_MAX,
		});

		for (let i = 0; i < entryCount; i += 1) {
			const createdAt = faker.date.recent({ days: 60 });
			entryRows.push({
				id: faker.string.uuid(),
				userId: user.id,
				content: fakeJournalContent(),
				mood: fakeMood(),
				tags: fakeTags(),
				createdAt,
			});
		}
	}

	await prisma.journalEntry.createMany({
		data: entryRows.map((entry) => ({
			id: entry.id,
			userId: entry.userId,
			content: entry.content,
			mood: entry.mood,
			tags: entry.tags,
			createdAt: entry.createdAt,
			updatedAt: entry.createdAt,
		})),
	});

	const publishCandidates = entryRows.filter(() =>
		faker.datatype.boolean({ probability: PUBLISH_RATIO }),
	);

	console.log(`Creating ${publishCandidates.length} posts…`);
	const postRows: Array<{
		id: string;
		authorId: string;
		journalEntryId: string;
		content: string;
		mood: number | null;
		tags: string[];
		status: (typeof PostStatus)[keyof typeof PostStatus];
		createdAt: Date;
	}> = [];

	for (const entry of publishCandidates) {
		const createdAt = new Date(entry.createdAt.getTime() + 60_000);
		postRows.push({
			id: faker.string.uuid(),
			authorId: entry.userId,
			journalEntryId: entry.id,
			content: entry.content,
			mood: entry.mood,
			tags: entry.tags,
			status: pickPostStatus(),
			createdAt,
		});
	}

	await prisma.post.createMany({
		data: postRows.map((post) => ({
			id: post.id,
			authorId: post.authorId,
			journalEntryId: post.journalEntryId,
			content: post.content,
			mood: post.mood,
			tags: post.tags,
			status: post.status,
			createdAt: post.createdAt,
			updatedAt: post.createdAt,
		})),
	});

	const activePosts = postRows.filter((post) => post.status === PostStatus.ACTIVE);
	const commentRows: Array<{
		postId: string;
		authorId: string;
		content: string;
		status: (typeof CommentStatus)[keyof typeof CommentStatus];
		createdAt: Date;
	}> = [];

	console.log(`Creating comments for ${activePosts.length} active posts…`);
	for (const post of activePosts) {
		const commentCount = faker.number.int({
			min: COMMENTS_PER_ACTIVE_POST_MIN,
			max: COMMENTS_PER_ACTIVE_POST_MAX,
		});

		for (let i = 0; i < commentCount; i += 1) {
			const author =
				faker.helpers.arrayElement(
					users.filter((user) => user.id !== post.authorId),
				) ?? users[0]!;

			commentRows.push({
				postId: post.id,
				authorId: author.id,
				content: fakeCommentContent(),
				status: pickCommentStatus(),
				createdAt: faker.date.between({
					from: post.createdAt,
					to: new Date(),
				}),
			});
		}
	}

	const COMMENT_BATCH = 500;
	for (let offset = 0; offset < commentRows.length; offset += COMMENT_BATCH) {
		const batch = commentRows.slice(offset, offset + COMMENT_BATCH);
		await prisma.comment.createMany({
			data: batch.map((comment) => ({
				postId: comment.postId,
				authorId: comment.authorId,
				content: comment.content,
				status: comment.status,
				createdAt: comment.createdAt,
				updatedAt: comment.createdAt,
			})),
		});
	}

	console.log('Seed complete:');
	console.log(`  users:    ${users.length}`);
	console.log(`  entries:  ${entryRows.length}`);
	console.log(`  posts:    ${postRows.length}`);
	console.log(`  comments: ${commentRows.length}`);
	console.log(`  login:    seed.user.1@example.com / ${SEED_PASSWORD}`);
}
