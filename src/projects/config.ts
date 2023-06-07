import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Archetype, Settings, Subfolder } from '../types.js';
import {
	getPackageJsonContent,
	getPostcssConfigCjsContent,
	getTailwindConfigCjsContent,
	getUrlTsContent
} from '../files/config/index.js';

export function createConfigProject(dir: string, settings: Settings): void {
	dir = path.join(dir, Subfolder.shared, Archetype.config);
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
