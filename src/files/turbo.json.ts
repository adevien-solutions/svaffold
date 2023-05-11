export function getTurboJsonContent(): string {
	return `{
	"$schema": "https://turbo.build/schema.json",
	"pipeline": {
		"package": {
			"outputs": ["package/**"]
		},
		"build": {
			"dependsOn": ["^build"],
			"outputs": ["dist/**", ".build/**", "svelte-kit/**"]
		},
		"lint": {},
		"check": {},
		"dev": {
			"cache": false
		},
		"preview": {
			"cache": false
		}
	}
}	
`;
}
