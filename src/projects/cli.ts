import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync } from 'fs';
import { Archetype, Settings } from '../types.js';

export async function createCliProject(dir: string, settings: Settings): Promise<void> {
	dir = path.join(process.cwd(), dir, `projects/${Archetype.cli}`);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	// TODO

	process.exit();
}

createCliProject(argv[2], JSON.parse(argv[3]));
