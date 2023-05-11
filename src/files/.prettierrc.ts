export function getPrettierrcContent(): string {
	return `{
	"useTabs": true,
	"printWidth": 90,
	"tabWidth": 2,
	"semi": true,
	"trailingComma": "none",
	"singleQuote": true,
	"plugins": ["prettier-plugin-svelte"],
	"overrides": [
		{
			"files": "*.svelte",
			"options": { "parser": "svelte" }
		}
	]
}	
`;
}
