import { Archetype, Settings } from '../../types.js';
import { getPackageVersion, stringify } from '../../utils.js';

export function getPackageJsonContent(settings: Settings): string {
	const packageJson = {
		name: `@${settings.client}/${Archetype.cli}`,
		version: '0.0.1',
		main: 'index.js',
		scripts: {
			dev: 'npx tsc --watch',
			check: 'eslint src',
			test: 'echo "Error: no test specified" && exit 1',
			build: 'npx tsc',
			preview: 'node index.js'
		},
		dependencies: {
			'@clack/prompt': getPackageVersion('@clack/prompt'),
			kleur: getPackageVersion('kleur')
		},
		devDependencies: {
			'@types/node': '^20.1.0',
			'@typescript-eslint/eslint-plugin': '^5.59.2',
			'@typescript-eslint/parser': '^5.59.2',
			eslint: '^8.40.0',
			'eslint-config-prettier': '^8.8.0',
			prettier: '^2.8.8',
			typescript: '^5.0.4'
		}
	};
	return stringify(packageJson);
}
