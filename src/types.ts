export enum Archetype {
	landing = 'landing',
	blog = 'blog',
	app = 'app',
	cms = 'cms',
	asset = 'asset',
	cli = 'cli'
}

export type Archetypes = Readonly<
	{
		name: string;
		value: Archetype;
	}[]
>;

export type Settings = {
	client: string;
	archetypes: Archetype[];
	designSystem?: string;
	svelteDeploy?: string;
	cms?: string;
	assetDeploy?: string;
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
		value: Archetype.asset
	},
	{
		name: 'CLI tool',
		value: Archetype.cli
	}
] as const;
