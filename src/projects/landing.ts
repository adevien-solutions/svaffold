import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync } from 'fs';
import { create } from 'create-svelte';
import { Archetype, Settings } from '../types.js';

export async function createLandingProject(dir: string, settings: Settings): Promise<void> {
	dir = path.join(process.cwd(), dir, `projects/${Archetype.landing}`);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	await create('.', {
		name: `@${settings.client}/landing`,
		template: 'skeleton',
		types: 'typescript',
		prettier: true,
		eslint: true,
		playwright: true,
		vitest: true
	});

	process.exit();
}

createLandingProject(argv[2], JSON.parse(argv[3]));
