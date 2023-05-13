import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Archetype, Settings } from '../types.js';
import {
	getPackageJsonContent,
	getPostcssConfigCjsContent,
	getTailwindConfigCjsContent,
	getUrlTsContent
} from '../files/config/index.js';

export async function createConfigProject(dir: string, settings: Settings): Promise<void> {
	dir = path.join(dir, `shared/${Archetype.config}`);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	writeFileSync('package.json', getPackageJsonContent(settings));
	writeFileSync('index.ts', "export * from './url';\n");
	writeFileSync('url.ts', getUrlTsContent(settings));
	writeFileSync('postcss.config.cjs', getPostcssConfigCjsContent());
	writeFileSync('tailwind.config.cjs', getTailwindConfigCjsContent(settings));
	writeFileSync('README.md', `# @${settings.client}/${Archetype.config}\n`);

	process.exit();
}

createConfigProject(argv[2], JSON.parse(argv[3]));
