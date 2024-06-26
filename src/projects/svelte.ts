import { execSync } from 'child_process';
import { create } from 'create-svelte';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { argv } from 'process';
import {
	getPackageJsonContent,
	getPostcssConfigCjsContent,
	getTailwindConfigCjsContent
} from '../files/svelte/index.js';
import { Archetype, Settings, Subfolder } from '../types.js';
import { isSharedType, replaceInFile } from '../utils.js';

export async function createSvelteProject(
	type: Archetype,
	dir: string,
	settings: Settings
): Promise<void> {
	const { client } = settings;
	dir = path.join(dir, Subfolder[isSharedType(type) ? 'shared' : 'projects'], type);
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

	writeFileSync('package.json', await getPackageJsonContent(settings, type));
	const plugins = settings.designSystem === 'none' ? ' --typography' : '';
	execSync(`npx svelte-add@latest tailwindcss${plugins}`);
	writeFileSync('tailwind.config.cjs', getTailwindConfigCjsContent(settings));
	writeFileSync('postcss.config.cjs', getPostcssConfigCjsContent(settings));
	writeFileSync('README.md', `# @${client}/${type}\n`);
	replaceInFile(
		'svelte.config.js',
		'adapter: adapter()',
		`adapter: adapter(),
		env: {
			dir: '../..'
		}`
	);
	if (settings.designSystem === 'skeleton') {
		replaceInFile(
			'src/routes/+layout.svelte',
			"import '../app.postcss';",
			`// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';`
		);
	}
	rmSync('.prettierrc');
	rmSync('.prettierignore');

	process.exit();
}

await createSvelteProject(argv[2] as Archetype, argv[3], JSON.parse(argv[4]));
