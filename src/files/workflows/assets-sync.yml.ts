import chalk from 'chalk';
import { Announcer } from '../../announcer.js';
import { Archetype, Settings } from '../../types.js';

export function getAssetsSyncYmlContent(settings: Settings): string {
	const { client } = settings;
	Announcer.addDelayedMessage(`Add the following secrets to your GitHub repository:
  - ${chalk.green('GCP_SERVICE_ACCOUNT_KEY_FILE')}
  - ${chalk.green('GCP_STORAGE_BUCKET')}
Learn more about how to obtain them here: ${chalk.green(
		'https://cloud.google.com/storage/docs/authentication/managing-hmackeys'
	)}`);

	return `name: Sync @${client}/${Archetype.assets} with GCS

on:
  push:
    branches:
      - main
    paths:
      - "projects/${Archetype.assets}/static/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Sync assets
        uses: omppye-tech/gcp-storage-sync@main
        with:
          args: -d
        env:
          GCP_SERVICE_ACCOUNT_KEY_FILE: \${{ secrets.GCP_SERVICE_ACCOUNT_KEY_FILE }}
          GCP_STORAGE_BUCKET: \${{ secrets.GCP_STORAGE_BUCKET }}
          SOURCE_DIR: "projects/${Archetype.assets}/static"
`;
}
