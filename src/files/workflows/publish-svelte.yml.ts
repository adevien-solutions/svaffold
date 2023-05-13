import chalk from 'chalk';
import { Announcer } from '../../announcer.js';
import { Archetype, Settings } from '../../types.js';

export function getPublishSvelteYmlContent(settings: Settings, type: Archetype): string {
	if (settings.svelteDeploy !== 'cloudflare') {
		return '';
	}
	const { client } = settings;
	Announcer.addDelayedMessage(`Add the following secrets to your GitHub repository:
  - ${chalk.green('CLOUDFLARE_API_TOKEN')}
  - ${chalk.green('CLOUDFLARE_ACCOUNT_ID')}
Learn more about how to obtain them here: ${chalk.green(
		'https://github.com/cloudflare/pages-action/blob/main/README.md'
	)}`);

	return `name: Deploy @${client}/${type}

on:
  workflow_dispatch:

  push:
    branches:
      - main
    paths:
      - 'projects/${type}/**'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    name: Publish to Cloudflare Pages
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 7.18
          run_install: |
            - recursive: true
              args: [--frozen-lockfile, --strict-peer-dependencies]

      - name: Build
        run: pnpm build:${type}

      - name: Publish to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ${client}-${type}
          directory: sites/landing/.svelte-kit/cloudflare
          # Optional: Enable this if you want to have GitHub Deployments triggered
          # gitHubToken: \${{ secrets.GITHUB_TOKEN }}
`;
}
