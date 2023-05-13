import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Archetype, Settings } from '../types.js';
import { getPackageJsonContent, getIndexJsContent } from '../files/assets/index.js';

export async function createAssetsProject(dir: string, settings: Settings): Promise<void> {
	dir = path.join(dir, `projects/${Archetype.assets}`);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	writeFileSync('package.json', getPackageJsonContent(settings));
	writeFileSync('index.js', getIndexJsContent());
	writeFileSync('README.md', `# @${settings.client}/${Archetype.assets}\n`);
	mkdirSync('static');

	process.exit();
}

createAssetsProject(argv[2], JSON.parse(argv[3]));
