import inquirer from 'inquirer';
import { Archetype, Settings } from './types.js';
import { SVELTE_APPS, OTHER_APPS, CHOICES } from './constants.js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { StdioOptions, execSync, fork } from 'child_process';
import { Announcer } from './announcer.js';

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
			choices: [...SVELTE_APPS, ...OTHER_APPS]
		},
		{
			name: 'designSystem',
			type: 'list',
			message: 'Select a design system',
			suffix: ' (Tailwind will be installed)',
			default: 'daisy',
			choices: CHOICES.designSystem,
			when: ({ archetypes }: { archetypes: string[] }): boolean => {
				return SVELTE_APPS.some((app) => archetypes.includes(app.value));
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
				return SVELTE_APPS.some((app) => archetypes.includes(app.value));
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
		},
		{
			name: 'repoUrl',
			type: 'input',
			message: 'Repository URL',
			suffix:
				' (leave blank or add an empty repository - preferably GitHub, so GitHub Actions can be generated)',
			validate: (input: string): boolean => {
				try {
					return input ? !!new URL(input) : true;
				} catch (_) {
					return false;
				}
			}
		}
	]);

	return { ...answers, archetypes: [...answers.archetypes, Archetype.config], options };
}

export function isSvelteType(type: Archetype): boolean {
	return SVELTE_APPS.find((app) => app.value === type) !== undefined;
}

export function isSharedType(type: Archetype): boolean {
	return type === Archetype.config || type === Archetype.lib;
}

export function replaceInFile(
	path: string,
	replaceFrom: string,
	replaceTo: string,
	all = false
): void {
	const file = readFileSync(path, 'utf8');
	writeFileSync(path, file[all ? 'replaceAll' : 'replace'](replaceFrom, replaceTo));
}

export async function getPackageVersion(name: string): Promise<string> {
	const version = execSync(`npm view ${name} version`).toString().trim();
	return '^' + version;
}

export function isRepoOnGitHub(url: string): boolean {
	try {
		const { host } = new URL(url);
		return host.includes('github');
	} catch (_) {
		return false;
	}
}

export function getDirName(url: string): string {
	const filename = fileURLToPath(url);
	return path.dirname(filename);
}

export function getStdioSetting(settings: Settings): StdioOptions {
	return settings.options.verbose ? 'inherit' : 'ignore';
}

export function stringify(obj: Record<string, unknown>): string {
	return JSON.stringify(obj, null, 2) + '\n';
}

export function updateLocalPackageJson(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	modifier: (packageJson: Record<string, any>) => void
): void {
	const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
	modifier(packageJson);
	writeFileSync('./package.json', stringify(packageJson));
}

export function createProcessForkPromise(
	relativeFilePath: string,
	args: string[] = []
): Promise<void> {
	return new Promise<void>((resolve) => {
		const proc = fork(path.join(getDirName(import.meta.url), relativeFilePath), args);
		proc.on('message', (message) => Announcer.addDelayedMessage(message.toString()));
		proc.once('exit', resolve);
	});
}

export function isWindows(): boolean {
	return /^win/.test(process.platform);
}
