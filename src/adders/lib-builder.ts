import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { Archetype, Settings } from '../types.js';
import { execSync } from 'child_process';
import { stringify } from '../utils.js';

export async function addLibBuilder(dir: string, settings: Settings): Promise<void> {
	if (!settings.libBuilder || settings.libBuilder === 'none') {
		process.exit();
	}
	dir = path.join(dir, `shared/${Archetype.lib}`);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
	let isUpdated = false;

	if (settings.libBuilder === 'storybook') {
		execSync('npx storybook@latest init --type sveltekit --yes');
		if (packageJson.scripts['story:dev']) {
			packageJson.scripts['story:dev'] += ' --disable-telemetry';
			isUpdated = true;
		}
	}

	isUpdated && writeFileSync('package.json', stringify(packageJson));
	process.exit();
}

await addLibBuilder(argv[2], JSON.parse(argv[3]));
