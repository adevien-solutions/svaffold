import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync } from 'fs';
import { Archetype, Settings } from '../types.js';

export async function createLibProject(dir: string, settings: Settings): Promise<void> {
	dir = path.join(process.cwd(), dir, `shared/${Archetype.lib}`);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	// TODO

	process.exit();
}

createLibProject(argv[2], JSON.parse(argv[3]));
