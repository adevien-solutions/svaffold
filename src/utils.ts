import inquirer from 'inquirer';
import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { fork } from 'child_process';
import { Archetype, Settings } from './types';
import { svelteApps, otherApps, CHOICES } from './constants';
import {
	getDockerfileContent,
	getGitignoreContent,
	getPackageJsonContent,
	getPnpmWorkspaceYamlContent,
	getPrettierignoreContent,
	getPrettierrcContent,
	getReadmeMdContent,
	getTurboJsonContent
} from './files/index';
import { Announcer } from './announcer';

export async function getSettings(options: Settings['options']): Promise<Settings> {
	const answers = await inquirer.prompt<Settings>([
		{
			name: 'client',
			type: 'input',
			message: 'Client name',
			suffix: ' (only letters, dashes, and underscores)',
			validate: (input: string): boolean => {
				return /^[a-z_-]+$/i.test(input);
			}
		},
		{
			name: 'archetypes',
			type: 'checkbox',
			message: 'Select project archetypes',
			choices: [...svelteApps, ...otherApps]
		},
		{
			name: 'designSystem',
			type: 'list',
			message: 'Select a design system',
			suffix: ' (Tailwind will be installed)',
			default: 'daisy',
			choices: CHOICES.designSystem,
			when: ({ archetypes }: { archetypes: string[] }): boolean => {
				return svelteApps.some((app) => archetypes.includes(app.value));
			}
		},
		{
			name: 'libBuilder',
			type: 'list',
			message: 'Select a component library builder',
			default: 'storybook',
			choices: CHOICES.libBuilder,
			when: ({ archetypes }: { archetypes: string[] }): boolean => {
				return archetypes.includes(Archetype.lib);
			}
		},
		{
			name: 'svelteDeploy',
			type: 'list',
			message: 'Select deployment platform for Svelte apps',
			default: 'auto',
			choices: CHOICES.svelteDeploy,
			when: ({ archetypes }: { archetypes: string[] }): boolean => {
				return svelteApps.some((app) => archetypes.includes(app.value));
			}
		},
		{
			name: 'cms',
			type: 'list',
			message: 'Select a CMS',
			default: 'payload',
			choices: CHOICES.cms,
			when: ({ archetypes }: { archetypes: string[] }): boolean => {
				return archetypes.includes(Archetype.cms);
			}
		},
		{
			name: 'assetDeploy',
			type: 'list',
			message: 'Select deployment platform for the Asset server',
			default: 'gcp',
			choices: CHOICES.assetDeploy,
			when: ({ archetypes }: { archetypes: string[] }): boolean => {
				return archetypes.includes(Archetype.assets);
			}
		}
	]);

	return { ...answers, archetypes: [...answers.archetypes, Archetype.config], options };
}

export async function createFiles(dir: string, settings: Settings): Promise<void> {
	Announcer.serialInfo('Creating files');
	createRoot(dir, settings);
	await Promise.all(createProjects(settings.archetypes, dir, settings));
}

function createRoot(dir: string, settings: Settings): void {
	const root = process.cwd();
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);
	const files = {
		'.gitignore': getGitignoreContent(),
		'.prettierignore': getPrettierignoreContent(),
		'.prettierrc': getPrettierrcContent(),
		Dockerfile: getDockerfileContent(),
		'package.json': getPackageJsonContent(settings),
		'pnpm-workspace.yaml': getPnpmWorkspaceYamlContent(settings),
		'README.md': getReadmeMdContent(settings),
		'turbo.json': getTurboJsonContent()
	};
	Object.entries(files).forEach(([path, content]) =>
		checkAndWriteFile(path, content, settings.options.force)
	);
	process.chdir(root);
}

function createProjects(types: Archetype[], dir: string, settings: Settings): Promise<void>[] {
	return types.map((type) => {
		return new Promise<void>((resolve) => {
			const proc = fork(`./dist/projects/${type}.js`, [dir, JSON.stringify(settings)]);
			proc.once('exit', resolve);
		});
	});
	// const root = process.cwd();
	// const dir = (isSharedType(type) ? './shared/' : './projects/') + type;
	// existsSync(dir) || mkdirSync(dir, { recursive: true });
	// process.chdir(dir);
	// const projects: Record<Archetype, () => Promise<void>> = {
	// 	landing: () => createLandingProject(settings),
	// 	blog: () => createBlogProject(settings),
	// 	app: () => createAppProject(settings),
	// 	lib: () => createLibProject(settings),
	// 	cms: () => createCmsProject(settings),
	// 	assets: () => createAssetsProject(settings),
	// 	cli: () => createCliProject(settings),
	// 	config: () => createConfigProject(settings)
	// };
	// await projects[type]();
	// process.chdir(root);
}

export function trimDirectory(dir: string): string {
	return dir.replace(/\/$/, '');
}

export function checkAndWriteFile(path: string, content: string, force: boolean): void {
	if (!force && existsSync(path)) {
		const highlight = chalk.green(path);
		const force = chalk.yellow('--force');
		console.log(
			`Skipping ${highlight} as it already exists. Use ${force} to overwrite existing files.`
		);
	} else {
		writeFileSync(path, content);
	}
}

export async function installDependencies(dir: string, settings: Settings): Promise<void> {
	Announcer.serialInfo('Installing dependencies');
}

export async function initializeGit(dir: string, settings: Settings): Promise<void> {
	Announcer.serialInfo('Initializing git');
}

export function isSharedType(type: Archetype): boolean {
	return type === Archetype.config || type === Archetype.lib;
}
