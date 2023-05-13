import { Archetype, Settings } from '../types.js';

export function getPnpmWorkspaceYamlContent(settings: Settings): string {
	const hasProjects = settings.archetypes.filter((type) => type !== Archetype.lib).length > 0;

	return `packages:${hasProjects ? "\n  - 'projects/*'" : ''}
  - 'shared/*'
`;
}
