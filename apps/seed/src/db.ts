import { resolve } from 'node:path';

import { config } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { PrismaClient } from '../../api/src/generated/prisma/client';
import { MAIN_DB_NAME, SEED_DB_NAME } from './consts';

config({ path: resolve(__dirname, '../.env') });

const DB_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export function getSeedDatabaseUrl(): string {
	const url = process.env.SEED_DATABASE_URL?.trim();
	if (!url) {
		throw new Error(
			'SEED_DATABASE_URL is required. Copy apps/seed/.env.example to apps/seed/.env',
		);
	}

	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error('SEED_DATABASE_URL is not a valid URL');
	}

	const dbName = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
	assertSafeSeedDbName(dbName);
	return url;
}

export function assertSafeSeedDbName(dbName: string): void {
	if (!dbName || !DB_NAME_PATTERN.test(dbName)) {
		throw new Error(`Invalid seed database name: "${dbName}"`);
	}

	if (dbName === MAIN_DB_NAME) {
		throw new Error(
			`Refusing to use SEED_DATABASE_URL pointing at "${MAIN_DB_NAME}". Use "${SEED_DB_NAME}" instead.`,
		);
	}

	if (!dbName.endsWith('_seed')) {
		throw new Error(
			`SEED_DATABASE_URL database name must end with "_seed" (got "${dbName}").`,
		);
	}
}

export function getDbNameFromUrl(url: string): string {
	return decodeURIComponent(new URL(url).pathname.replace(/^\//, ''));
}

function toAdminUrl(seedUrl: string): string {
	const admin = new URL(seedUrl);
	admin.pathname = `/${MAIN_DB_NAME}`;
	return admin.toString();
}

export async function ensureSeedDatabase(): Promise<void> {
	const seedUrl = getSeedDatabaseUrl();
	const dbName = getDbNameFromUrl(seedUrl);
	assertSafeSeedDbName(dbName);

	const pool = new Pool({ connectionString: toAdminUrl(seedUrl) });
	try {
		const existing = await pool.query<{ exists: boolean }>(
			`SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) AS exists`,
			[dbName],
		);

		if (!existing.rows[0]?.exists) {
			console.log(`Creating database "${dbName}"…`);
			await pool.query(`CREATE DATABASE "${dbName}"`);
		}
	} finally {
		await pool.end();
	}
}

export type SeedPrisma = PrismaClient;

export function createSeedPrisma(): { prisma: SeedPrisma; pool: Pool } {
	const connectionString = getSeedDatabaseUrl();
	const pool = new Pool({ connectionString });
	const adapter = new PrismaPg(pool);
	const prisma = new PrismaClient({ adapter });
	return { prisma, pool };
}

export async function disconnectSeedPrisma(
	prisma: SeedPrisma,
	pool: Pool,
): Promise<void> {
	await prisma.$disconnect();
	await pool.end();
}
