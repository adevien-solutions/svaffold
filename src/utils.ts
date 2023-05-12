import inquirer from 'inquirer';
import { Archetype, Settings } from './types.js';
import { svelteApps, otherApps, CHOICES } from './constants.js';
import { readFileSync, writeFileSync } from 'fs';

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

export function isSvelteType(type: Archetype): boolean {
	return svelteApps.find((app) => app.value === type) !== undefined;
}

export function isSharedType(type: Archetype): boolean {
	return type === Archetype.config || type === Archetype.lib;
}

export function replaceInFile(path: string, replaceFrom: string, replaceTo: string): void {
	const file = readFileSync(path, 'utf8');
	writeFileSync(path, file.replace(replaceFrom, replaceTo));
}
