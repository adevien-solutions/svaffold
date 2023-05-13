import { readFileSync, writeFileSync } from 'fs';
import { Archetype, Settings } from '../../types.js';

export async function getPackageJsonContent(settings: Settings, type: Archetype): Promise<string> {
	const { client } = settings;
	const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
	packageJson.name = `@${client}/${type}`;
	packageJson.devDependencies[`@${client}/${Archetype.config}`] = 'workspace:*';
	if (settings.archetypes.includes(Archetype.lib)) {
		packageJson.devDependencies[`@${client}/${Archetype.lib}`] = 'workspace:*';
	}
	if (settings.designSystem === 'skeleton') {
		const { version } = await (
			await fetch('https://raw.githubusercontent.com/skeletonlabs/skeleton/dev/package.json')
		).json();
		packageJson.devDependencies['@skeletonlabs/skeleton'] = version.replace('v', '^');
	}
	writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
	return JSON.stringify(packageJson, null, 2) + '\n';
}
