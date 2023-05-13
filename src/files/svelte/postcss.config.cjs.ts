import { Archetype, Settings } from '../../types.js';

export function getPostcssConfigCjsContent(settings: Settings): string {
	return `module.exports = require('@${settings.client}/${Archetype.config}/postcss.config.cjs')\n`;
}
