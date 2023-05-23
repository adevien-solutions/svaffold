import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { Archetype } from '../types.js';

export async function syncSvelte(type: Archetype, dir: string): Promise<void> {
	const folder = type === Archetype.lib ? 'shared' : 'projects';
	dir = path.join(dir, `${folder}/${type}`);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	execSync('npx @sveltejs/kit@latest sync');

	process.exit();
}

await syncSvelte(argv[2] as Archetype, argv[3]);
