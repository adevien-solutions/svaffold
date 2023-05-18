import { SCRIPT_TYPES, SVELTE_APPS } from '../constants.js';
import { Archetype, ScriptType, Settings } from '../types.js';
import { getPackageVersion } from '../utils.js';

export async function getPackageJsonContent(settings: Settings): Promise<string> {
	const { client } = settings;
	return `{
	"name": "@${client}/monorepo",
	"version": "0.0.1",
	"scripts": {
		${SCRIPT_TYPES.map((script) => {
			const typeScripts = settings.archetypes.filter((type) =>
				getScriptTypes(type, settings).includes(script)
			);
			if (!typeScripts.length) return;

			let general = getScriptString(script, settings);
			if (general) {
				general = `"${script}": "${general}",`;
			}
			typeScripts.forEach((type) => {
				const scriptString = `"${script}:${type}": "${getScriptString(script, settings, type)}",`;
				general += general ? `\n\t\t${scriptString}` : scriptString;
			});
			return general;
		})
			.filter(Boolean)
			.join('\n\n\t\t')
			.trim()
			.slice(0, -1)}
	},
	"devDependencies": {
		"turbo": "${await getPackageVersion('turbo')}",
		"dotenv-cli": "${await getPackageVersion('dotenv-cli')}"
	}
}
`;
}

function getScriptTypes(type: Archetype, settings: Settings): ScriptType[] {
	if (type === Archetype.assets || type === Archetype.config) {
		return [];
	}
	if (type === Archetype.cms) {
		return ['dev', 'build', 'preview', 'docker-build', 'docker-preview'];
	}
	if (type === Archetype.cli) {
		return ['dev', 'check', 'test', 'build', 'preview'];
	}
	if (SVELTE_APPS.find((app) => app.value === type)) {
		if (settings.svelteDeploy === 'docker') {
			if (type === Archetype.lib) {
				return [...SCRIPT_TYPES];
			}
			return SCRIPT_TYPES.filter((s) => !s.startsWith('story-'));
		} else {
			const filtered = SCRIPT_TYPES.filter((s) => !s.startsWith('docker-'));
			if (type === Archetype.lib) {
				return [...filtered];
			}
			return filtered.filter((s) => !s.startsWith('story-'));
		}
	}
	return ['dev', 'test', 'build'];
}

function getScriptString(script: ScriptType, settings: Settings, type?: Archetype): string {
	const { client } = settings;
	const hasAssets = settings.archetypes.includes(Archetype.assets);
	const scripts: Record<ScriptType, { general: string; scoped: string }> = {
		dev: {
			general: `dotenv -- turbo run dev --parallel --filter=./projects/** --filter=@${client}/${Archetype.lib}`,
			scoped: `dotenv -- turbo run dev${
				hasAssets ? ` --parallel --filter=@${client}/${Archetype.assets}` : ''
			} --filter=@${client}/${type}`
		},
		check: {
			general: `turbo run check --parallel --filter=./projects/** --filter=@${client}/${Archetype.lib}`,
			scoped: `turbo run check --filter=@${client}/${type}`
		},
		test: {
			general: `turbo run test --parallel --filter=./projects/** --filter=@${client}/${Archetype.lib}`,
			scoped: `turbo run test --filter=@${client}/${type}`
		},
		build: {
			general: `turbo run build --parallel --filter=./projects/** --filter=@${client}/${Archetype.lib}`,
			scoped: `turbo run build --filter=@${client}/${type}`
		},
		preview: {
			general: `turbo run preview --parallel --filter=./projects/** --filter=@${client}/${Archetype.lib}`,
			scoped: `turbo run preview --filter=@${client}/${type}`
		},
		'story-dev': {
			general: '',
			scoped: `turbo run story:dev --filter=${client}/${type}`
		},
		'story-build': {
			general: '',
			scoped: `turbo run story:build --filter=${client}/${type}`
		},
		'story-preview': {
			general: '',
			scoped: `turbo run story:preview --filter=${client}/${type}`
		},
		'docker-build': {
			general: '',
			scoped: `docker build --platform linux/amd64 -t ${client}/${type} --build-arg project=${type} .`
		},
		'docker-preview': {
			general: '',
			scoped: `docker run -p 80:80 --env-file .env --rm --name ${client}-${type} ${client}/${type}`
		}
	};
	return type ? scripts[script].scoped : scripts[script].general;
}
