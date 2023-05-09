import inquirer from 'inquirer';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Archetype, otherApps, Settings, svelteApps } from './types.js';
import { getPackageJsonContent } from './files/package.json.js';
import chalk from 'chalk';

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
			choices: [
				{
					name: 'DaisyUI',
					value: 'daisy'
				},
				{
					name: 'SkeletonUI',
					value: 'skeleton'
				},
				{
					name: 'None',
					value: 'none'
				}
			],
			when: ({ archetypes }: { archetypes: string[] }): boolean => {
				return svelteApps.some((app) => archetypes.includes(app.value));
			}
		},
		{
			name: 'svelteDeploy',
			type: 'list',
			message: 'Select deployment platform for Svelte apps',
			default: 'auto',
			choices: [
				{
					name: 'Auto',
					value: 'auto'
				},
				{
					name: 'Cloudflare',
					value: 'cloudflare'
				},
				{
					name: 'Vercel',
					value: 'vercel'
				},
				{
					name: 'Docker (Node.js)',
					value: 'docker'
				}
			],
			when: ({ archetypes }: { archetypes: string[] }): boolean => {
				return svelteApps.some((app) => archetypes.includes(app.value));
			}
		},
		{
			name: 'cms',
			type: 'list',
			message: 'Select a CMS',
			default: 'payload',
			choices: [
				{
					name: 'Payload',
					value: 'payload'
				}
				// TODO
				// {
				// 	name: 'Sanity',
				// 	value: 'sanity'
				// },
				// {
				// 	name: 'Storyblok',
				// 	value: 'storyblok'
				// }
			],
			when: ({ archetypes }: { archetypes: string[] }): boolean => {
				return archetypes.includes(Archetype.cms);
			}
		},
		{
			name: 'assetDeploy',
			type: 'list',
			message: 'Select deployment platform for the Asset server',
			default: 'gcp',
			choices: [
				{
					name: 'None',
					value: 'none'
				},
				{
					name: 'GCP Cloud Storage',
					value: 'gcp'
				}
				// TODO
				// {
				// 	name: 'AWS S3',
				// 	value: 'aws'
				// },
				// {
				// 	name: 'Cloudflare R2',
				// 	value: 'cloudflare'
				// },
			],
			when: ({ archetypes }: { archetypes: string[] }): boolean => {
				return archetypes.includes(Archetype.assets);
			}
		}
	]);

	return { ...answers, options };
}

export function createRoot(dir: string, settings: Settings): void {
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);
	checkAndWriteFile('package.json', getPackageJsonContent(settings), settings.options.force);
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
