import inquirer from 'inquirer';
import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Archetype, Settings } from './types.js';
import { svelteApps, otherApps, CHOICES } from './constants.js';
import {
	getDockerfileContent,
	getGitignoreContent,
	getPackageJsonContent,
	getPnpmWorkspaceYamlContent,
	getPrettierignoreContent,
	getPrettierrcContent,
	getReadmeMdContent,
	getTurboJsonContent
} from './files/index.js';

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

export function createFiles(dir: string, settings: Settings): void {
	announce('1. Creating files');
	createRoot(dir, settings);
}

function createRoot(dir: string, settings: Settings): void {
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
}

function checkAndWriteFile(path: string, content: string, force: boolean): void {
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
	announce('2. Installing dependencies');
}

export async function initializeGit(dir: string, settings: Settings): Promise<void> {
	announce('3. Initializing git');
}

export function isSharedType(type: Archetype): boolean {
	return type === Archetype.config || type === Archetype.lib;
}

function announce(text: string): void {
	console.log(chalk.blue.bold(text));
}
