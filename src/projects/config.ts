import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync } from 'fs';
import { Archetype, Settings } from '../types';

export async function createConfigProject(dir: string, settings: Settings): Promise<void> {
	dir = path.join(process.cwd(), dir, `shared/${Archetype.config}`);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	// TODO

	process.exit();
}

createConfigProject(argv[2], JSON.parse(argv[3]));
