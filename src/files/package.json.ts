import { Archetype, Settings } from '../types.js';

export function getPackageJsonContent(settings: Settings): string {
	const { client } = settings;
	const hasAssets = settings.archetypes.includes(Archetype.assets);
	return `{
	"name": "@${client}/monorepo",
	"version": "0.0.1",
	"scripts": {
		${['dev', 'check', 'build', 'preview']
			.map((script) => {
				let general = `\t\t"${script}": "turbo run dev --parallel --filter=!@${client}/lib --filter=!@${client}/config",`;
				settings.archetypes.forEach((type) => {
					general += `\n\t\t"${script}:${type}": "turbo run ${script}${
						hasAssets ? ` --parallel --filter=@${client}/${Archetype.assets}` : ''
					} --filter=@${client}/${type}",`;
				});
				return general;
			})
			.join('\n\n')
			.trim()
			.slice(0, -1)}
	}
}`;
}
