export function getPostcssConfigCjsContent(): string {
	return `module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
}
`;
}
