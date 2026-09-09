import { createSeedPrisma, disconnectSeedPrisma, ensureSeedDatabase, getDbNameFromUrl, getSeedDatabaseUrl } from './db';
import { pushSeedSchema } from './push-schema';
import { seedDatabase } from './seed';
import { wipeSeedDatabase } from './wipe';

async function runSeed(): Promise<void> {
	const url = getSeedDatabaseUrl();
	console.log(`Seeding database "${getDbNameFromUrl(url)}"…`);

	const { prisma, pool } = createSeedPrisma();
	try {
		await seedDatabase(prisma);
	} finally {
		await disconnectSeedPrisma(prisma, pool);
	}
}

async function runWipe(): Promise<void> {
	await pushSeedSchema();
	const url = getSeedDatabaseUrl();
	console.log(`Wiping database "${getDbNameFromUrl(url)}"…`);

	const { prisma, pool } = createSeedPrisma();
	try {
		await wipeSeedDatabase(prisma);
	} finally {
		await disconnectSeedPrisma(prisma, pool);
	}
}

async function main(): Promise<void> {
	const command = process.argv[2];

	if (command === 'seed') {
		await ensureSeedDatabase();
		await runSeed();
		return;
	}

	if (command === 'wipe') {
		await runWipe();
		return;
	}

	console.error('Usage: tsx src/main.ts <seed|wipe>');
	process.exit(1);
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
