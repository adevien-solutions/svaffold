export function getDockerignoreContent(): string {
	return `**/node_modules
.pnp
.pnp.js

# testing
coverage

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env.local
.env.development.local
.env.test.local
.env.production.local

# turbo
.turbo

# apps
**/build
**/dist
**/package
.svelte-kit
.vercel
`;
}
