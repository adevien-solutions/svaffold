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
	[Archetype.landing]: 'http://localhost:3000',
	[Archetype.blog]: 'http://localhost:3001',
	[Archetype.app]: 'http://localhost:3002',
	[Archetype.lib]: 'http://localhost:3003',
	[Archetype.cms]: 'http://localhost:6000',
	[Archetype.assets]: 'http://localhost:8000'
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
