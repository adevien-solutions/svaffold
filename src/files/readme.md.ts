import { Settings } from '../types.js';
import { isRepoOnGitHub, isSharedType } from '../utils.js';

export function getReadmeMdContent(settings: Settings): string {
	const isGitUrl = isRepoOnGitHub(settings.repoUrl) && settings.repoUrl.endsWith('.git');
	const repoName = isGitUrl ? settings.repoUrl.split('/').pop()?.split('.git')[0] : undefined;
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

1. ${isGitUrl ? `\`git clone ${settings.repoUrl}\`` : 'Clone the repository'}
1. ${repoName ? `\`cd ${repoName}\`` : '`cd` into the folder'}
1. \`pnpm install\`
1. \`pnpm dev\` _(or you can find more specific commands in the root
		\`package.json\`)_
`;
}
