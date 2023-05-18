import { Archetype, Settings } from '../../types.js';
import { stringify } from '../../utils.js';

export function getPackageJsonContent(settings: Settings): string {
	const packageJson = {
		name: `@${settings.client}/${Archetype.assets}`,
		version: '0.0.1',
		main: 'index.js',
		scripts: {
			dev: 'node index.js'
		},
		dependencies: {
			cors: '^2.8.5',
			express: '^4.18.2'
		}
	};
	return stringify(packageJson);
}
