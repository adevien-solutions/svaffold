import { Settings } from '../types';
import { isSharedType } from '../utils';

export function getReadmeMdContent(settings: Settings): string {
	return `# @${settings.client}/monorepo

## Workplaces

${settings.archetypes
	.filter((type) => !isSharedType(type))
	.map((type) => {
		return `- \`projects/${type}\``;
	})
	.join('\n')}
${settings.archetypes
	.filter(isSharedType)
	.map((type) => {
		return `- \`shared/${type}\``;
	})
	.join('\n')}

## Install

1. Clone the repository
1. \`cd\` into the folder
1. \`pnpm install\`
1. \`pnpm dev\` _(or you can find more specific commands in the root
		\`package.json\`)_
`;
}
