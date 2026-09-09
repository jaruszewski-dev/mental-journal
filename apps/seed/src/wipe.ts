import { TABLES_TO_TRUNCATE } from './consts';
import type { SeedPrisma } from './db';

export async function wipeSeedDatabase(prisma: SeedPrisma): Promise<void> {
	const tableList = TABLES_TO_TRUNCATE.map((name) => `"${name}"`).join(', ');

	await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`);

	console.log(`Wiped tables: ${TABLES_TO_TRUNCATE.join(', ')}`);
}
