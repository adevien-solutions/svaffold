export enum Archetype {
	landing = 'landing',
	blog = 'blog',
	app = 'app',
	cms = 'cms',
	assets = 'assets',
	cli = 'cli'
}

export type Archetypes = Readonly<
	{
		name: string;
		value: Archetype;
	}[]
>;

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

export type Settings = {
	client: string;
	options: {
		force: boolean;
	};
	archetypes: Archetype[];
	designSystem?: (typeof CHOICES.designSystem)[number]['value'];
	svelteDeploy?: (typeof CHOICES.svelteDeploy)[number]['value'];
	cms?: (typeof CHOICES.cms)[number]['value'];
	assetDeploy?: (typeof CHOICES.assetDeploy)[number]['value'];
};

export const svelteApps: Archetypes = [
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
	}
] as const;

export const otherApps: Archetypes = [
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

const SCRIPT_TYPES = [
	'dev',
	'check',
	'test',
	'build',
	'preview',
	'docker-build',
	'docker-preview'
] as const;

export type ScriptType = (typeof SCRIPT_TYPES)[number];

export const getScriptTypes = (type: Archetype, settings: Settings): ScriptType[] => {
	if (type === Archetype.assets) return ['dev'];
	if (svelteApps.find((app) => app.value === type)) {
		return settings.svelteDeploy === 'docker'
			? [...SCRIPT_TYPES]
			: SCRIPT_TYPES.filter((s) => !s.startsWith('docker-'));
	}
	return ['dev', 'test', 'build'];
};
