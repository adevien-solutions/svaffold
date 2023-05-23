import { AllSettings } from '../types.js';
import { stringify } from '../utils.js';

export function getTurboJsonContent(settings: AllSettings): string {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const json: Record<string, any> = {
		$schema: 'https://turbo.build/schema.json',
		pipeline: {
			package: {
				outputs: ['package/**']
			},
			build: {
				dependsOn: ['^build'],
				outputs: ['dist/**', '.build/**', 'svelte-kit/**']
			},
			lint: {},
			check: {},
			dev: {
				cache: false
			},
			preview: {
				cache: false
			}
		}
	};
	if (settings.libBuilder && settings.libBuilder !== 'none') {
		json.pipeline['story:dev'] = {
			cache: false
		};
		json.pipeline['story:build'] = {
			dependsOn: ['^story:build'],
			outputs: ['storybook-static/**']
		};
		json.pipeline['story:preview'] = {
			cache: false
		};
	}

	return stringify(json);
}
