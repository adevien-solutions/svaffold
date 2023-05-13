export function getTsconfigJsonContent(): string {
	return `{
	"compilerOptions": {
		"rootDir": "src",
		"outDir": "dist",
		"strict": true,
		"target": "ESNext",
		"module": "ESNext",
		"sourceMap": true,
		"esModuleInterop": true,
		"moduleResolution": "node",
		"noImplicitReturns": true
	},
	"exclude": ["dist/**/*", "node_modules/**/*"]
}
`;
}
