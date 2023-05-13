import { APP_DEV_URLS } from '../../constants.js';
import { Settings } from '../../types.js';
import { isSharedType } from '../../utils.js';

export function getUrlTsContent(settings: Settings): string {
	return `type Env = 'production' | 'development';

${settings.archetypes
	.filter((type) => !isSharedType(type))
	.map((type) => {
		if (type in APP_DEV_URLS) {
			const url = APP_DEV_URLS[type as keyof typeof APP_DEV_URLS].href;
			return `export const ${type} = {
	production: '${url}',
	development: '${url}'
} as const;
export const ${type.toUpperCase()}_URL = ${type}[process.env.NODE_ENV as Env];`;
		}
		return '';
	})
	.join('\n\n')}
`;
}
