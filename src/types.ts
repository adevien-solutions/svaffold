import { CHOICES, SCRIPT_TYPES } from './constants';

export enum Archetype {
	landing = 'landing',
	blog = 'blog',
	app = 'app',
	lib = 'lib',
	cms = 'cms',
	assets = 'assets',
	cli = 'cli',
	config = 'config'
}

export type Archetypes = Readonly<
	{
		name: string;
		value: Archetype;
	}[]
>;

export type Settings = {
	client: string;
	options: {
		force: boolean;
	};
	archetypes: Archetype[];
	designSystem?: (typeof CHOICES.designSystem)[number]['value'];
	libBuilder?: (typeof CHOICES.designSystem)[number]['value'];
	svelteDeploy?: (typeof CHOICES.svelteDeploy)[number]['value'];
	cms?: (typeof CHOICES.cms)[number]['value'];
	assetDeploy?: (typeof CHOICES.assetDeploy)[number]['value'];
};

export type ScriptType = (typeof SCRIPT_TYPES)[number];
