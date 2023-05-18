import { Archetype, Settings } from '../../types.js';
import { stringify } from '../../utils.js';

export function getPackageJsonContent(settings: Settings): string {
	const packageJson = {
		name: `@${settings.client}/${Archetype.config}`,
		version: '0.0.1',
		types: 'url.d.ts',
		files: ['tailwind.config.cjs', 'postcss.config.cjs', 'index.ts', 'url.ts']
	};
	return stringify(packageJson);
}
