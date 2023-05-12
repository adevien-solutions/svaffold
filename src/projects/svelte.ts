import path from 'path';
import { argv } from 'process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs';
import { create } from 'create-svelte';
import { Archetype, Settings } from '../types.js';
import { execSync } from 'child_process';
import { isSharedType } from '../utils.js';

export async function createSvelteProject(
	type: Archetype,
	dir: string,
	settings: Settings
): Promise<void> {
	const { client } = settings;
	dir = path.join(dir, `${isSharedType(type) ? 'shared' : 'projects'}/${type}`);
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	await create('.', {
		// Special characters get replaced by the create-svelte package
		name: 'PACKAGE_NAME',
		template: 'skeleton',
		types: 'typescript',
		prettier: true,
		eslint: true,
		playwright: true,
		vitest: true
	});

	const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
	packageJson.name = `@${client}/${type}`;
	packageJson.devDependencies[`@${client}/${Archetype.config}`] = 'workspace:*';
	if (settings.archetypes.includes(Archetype.lib)) {
		packageJson.devDependencies[`@${client}/${Archetype.lib}`] = 'workspace:*';
	}
	writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

	const daisy = settings.designSystem === 'daisy' ? ' --daisyui' : '';
	const plugins = settings.designSystem === 'none' ? ' --forms --typography' : '';
	execSync(`npx svelte-add@latest tailwindcss${daisy}${plugins}`);
	writeFileSync(
		'tailwind.config.cjs',
		`module.exports = require('@${client}/${Archetype.config}/tailwind.config.cjs')`
	);
	writeFileSync(
		'postcss.config.cjs',
		`module.exports = require('@${client}/${Archetype.config}/postcss.config.cjs')`
	);

	writeFileSync('README.md', `# @${client}/${type}\n`);
	rmSync('.prettierrc');
	rmSync('.prettierignore');

	// TODO tsconfig is supposed to support array files to extend from,
	// but it throws error
	// replaceInFile(
	// 	'tsconfig.json',
	// 	'"./.svelte-kit/tsconfig.json"',
	// 	`["./.svelte-kit/tsconfig.json", "@${client}/config/tsconfig.json"]`
	// );

	process.exit();
}

createSvelteProject(argv[2] as Archetype, argv[3], JSON.parse(argv[4]));
