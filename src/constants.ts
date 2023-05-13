import { Archetypes, Archetype } from './types.js';

export const CHOICES = {
	designSystem: [
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
	libBuilder: [
		// TODO
		// {
		// 	name: 'Storybook',
		// 	value: 'storybook'
		// },
		// {
		// 	name: 'Histoire',
		// 	value: 'histoire'
		// },
		{
			name: 'None',
			value: 'none'
		}
	],
	svelteDeploy: [
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
	cms: [
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
	assetDeploy: [
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
	]
} as const;

export const SVELTE_APPS: Archetypes = [
	{
		name: 'Landing page',
		value: Archetype.landing
	},
	{
		name: 'Blog',
		value: Archetype.blog
	},
	{
		name: 'Custom app',
		value: Archetype.app
	},
	{
		name: 'Component library',
		value: Archetype.lib
	}
] as const;

export const OTHER_APPS: Archetypes = [
	{
		name: 'CMS',
		value: Archetype.cms
	},
	{
		name: 'Asset server',
		value: Archetype.assets
	},
	{
		name: 'CLI tool',
		value: Archetype.cli
	}
] as const;

export const APP_DEV_URLS = {
	[Archetype.landing]: new URL('http://localhost:3000'),
	[Archetype.blog]: new URL('http://localhost:3001'),
	[Archetype.app]: new URL('http://localhost:3002'),
	[Archetype.lib]: new URL('http://localhost:3003'),
	[Archetype.cms]: new URL('http://localhost:6000'),
	[Archetype.assets]: new URL('http://localhost:8000')
} as const;

export const PACKAGE_VERSION_URLS = {
	'@skeletonlabs/skeleton':
		'https://raw.githubusercontent.com/skeletonlabs/skeleton/dev/package.json',
	'@sveltejs/adapter-cloudflare':
		'https://raw.githubusercontent.com/sveltejs/kit/master/packages/adapter-cloudflare/package.json',
	'@sveltejs/adapter-vercel':
		'https://raw.githubusercontent.com/sveltejs/kit/master/packages/adapter-vercel/package.json',
	'@sveltejs/adapter-node':
		'https://raw.githubusercontent.com/sveltejs/kit/master/packages/adapter-node/package.json',
	turbo: 'https://raw.githubusercontent.com/vercel/turbo/main/packages/turbo/package.json',
	'dotenv-cli': 'https://raw.githubusercontent.com/entropitor/dotenv-cli/master/package.json',
	'@clack/prompt':
		'https://raw.githubusercontent.com/natemoo-re/clack/main/packages/prompts/package.json',
	kleur: 'https://raw.githubusercontent.com/lukeed/kleur/master/package.json'
} as const;

export const SCRIPT_TYPES = [
	'dev',
	'check',
	'test',
	'build',
	'preview',
	'docker-build',
	'docker-preview'
] as const;
