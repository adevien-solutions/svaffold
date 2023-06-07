import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync } from 'fs';
import { Archetype, Settings, Subfolder } from '../types.js';
import { execSync } from 'child_process';
import { updateLocalPackageJson } from '../utils.js';

export async function addLibBuilder(dir: string, settings: Settings): Promise<void> {
	if (!settings.libBuilder || settings.libBuilder === 'none') {
		process.exit();
	}
	dir = path.join(dir, Subfolder.shared, Archetype.lib);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	if (settings.libBuilder === 'storybook') {
		execSync('npx storybook@latest init --type sveltekit --package-manager=pnpm --yes');
		updateLocalPackageJson((json) => {
			const dev = json.scripts.storybook || 'storybook dev -p 6006';
			const build = json.scripts['build-storybook'] || 'storybook build';

			json.scripts['story:dev'] = dev + ' --disable-telemetry';
			json.scripts['story:build'] = build + ' --disable-telemetry';
			json.scripts['story:preview'] = 'npx serve storybook-static';

			delete json.scripts.storybook;
			delete json.scripts['build-storybook'];
		});
	}

	process.exit();
}

await addLibBuilder(argv[2], JSON.parse(argv[3]));
