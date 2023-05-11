import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync } from 'fs';
import { Archetype, Settings } from '../types.js';

export async function createCmsProject(dir: string, settings: Settings): Promise<void> {
	dir = path.join(process.cwd(), dir, `projects/${Archetype.cms}`);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	// TODO

	process.exit();
}

createCmsProject(argv[2], JSON.parse(argv[3]));
