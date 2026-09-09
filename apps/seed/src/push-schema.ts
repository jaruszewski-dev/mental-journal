import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

import { ensureSeedDatabase, getSeedDatabaseUrl } from './db';

export async function pushSeedSchema(): Promise<void> {
	await ensureSeedDatabase();
	const databaseUrl = getSeedDatabaseUrl();
	const apiDir = resolve(__dirname, '../../api');

	console.log('Pushing Prisma schema to seed database…');
	const result = spawnSync('pnpm', ['exec', 'prisma', 'db', 'push', '--url', databaseUrl], {
		cwd: apiDir,
		env: process.env,
		stdio: 'inherit',
		shell: process.platform === 'win32',
	});

	if (result.status !== 0) {
		throw new Error('prisma db push failed for seed database');
	}
}
