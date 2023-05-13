export function getEslintrcCjsContent(): string {
	return `module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['dist/**', 'node_modules/**', '*.js', '*.cjs'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2019
	},
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'error'
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
`;
}
