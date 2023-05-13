import { Archetype, Settings } from '../../types.js';

export function getTailwindConfigCjsContent(settings: Settings): string {
	return `module.exports = require('@${settings.client}/${Archetype.config}/tailwind.config.cjs')\n`;
}
