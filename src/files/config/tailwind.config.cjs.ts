import { Archetype, Settings, Subfolder } from '../../types.js';

export function getTailwindConfigCjsContent(settings: Settings): string {
	const plugins: string[] = [];
	if (settings.designSystem === 'skeleton') {
		plugins.push("...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()");
	} else if (settings.designSystem === 'daisy') {
		plugins.push("require('daisyui')");
	} else {
		plugins.push("require('@tailwindcss/typography')");
	}

	return `/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'../../${Subfolder.shared}/${Archetype.lib}/src/**/*.{html,js,svelte,ts,svx}'${
		settings.designSystem === 'skeleton'
			? `,
		require('path').join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)`
			: ''
	}
	],
	theme: {
		extend: {},
	},
	plugins: [
		${plugins.join(',\n\t\t')}
	]
}
`;
}
