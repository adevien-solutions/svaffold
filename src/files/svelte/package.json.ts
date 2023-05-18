import { readFileSync } from 'fs';
import { APP_DEV_URLS } from '../../constants.js';
import { Archetype, Settings } from '../../types.js';
import { getPackageVersion, replaceInFile, stringify } from '../../utils.js';

export async function getPackageJsonContent(settings: Settings, type: Archetype): Promise<string> {
	const { client } = settings;
	const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
	packageJson.name = `@${client}/${type}`;
	packageJson.devDependencies[`@${client}/${Archetype.config}`] = 'workspace:*';
	if (type !== Archetype.lib && settings.archetypes.includes(Archetype.lib)) {
		packageJson.devDependencies[`@${client}/${Archetype.lib}`] = 'workspace:*';
	}
	if (
		type === Archetype.lib &&
		settings.libBuilder === 'storybook' &&
		packageJson.scripts['story:dev']
	) {
		packageJson.scripts['story:dev'] += ' --disable-telemetry';
	}
	if (settings.designSystem === 'skeleton') {
		const name = '@skeletonlabs/skeleton';
		packageJson.devDependencies[name] = await getPackageVersion(name);
	}
	if (settings.svelteDeploy && settings.svelteDeploy !== 'auto') {
		const adapter = settings.svelteDeploy === 'docker' ? 'node' : settings.svelteDeploy;
		const name: Parameters<typeof getPackageVersion>[0] = `@sveltejs/adapter-${adapter}`;
		packageJson.devDependencies[name] = await getPackageVersion(name);
		const autoAdapter = '@sveltejs/adapter-auto';
		delete packageJson.devDependencies[autoAdapter];
		replaceInFile('svelte.config.js', autoAdapter, name);
	}
	if (type in APP_DEV_URLS) {
		const { port } = APP_DEV_URLS[type as keyof typeof APP_DEV_URLS];
		packageJson.scripts.dev = `vite dev --open --port ${port}`;
	}

	return stringify(packageJson);
}
