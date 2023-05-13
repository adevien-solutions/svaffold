import { Archetype, Settings } from '../../types.js';

export function getPackageJsonContent(settings: Settings): string {
	const packageJson = {
		name: `@${settings.client}/${Archetype.config}`,
		version: '0.0.1',
		types: 'url.d.ts',
		files: ['tailwind.config.cjs', 'postcss.config.cjs', 'index', 'url.ts']
	};
	return JSON.stringify(packageJson, null, 2);
}
