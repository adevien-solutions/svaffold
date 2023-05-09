#! /usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { createRoot, getSettings } from './utils.js';

const program = new Command();
const versionNumber = readFileSync('version.txt', 'utf8');

program
	.version(versionNumber)
	.usage('npx @adevien/svelte-scaffold [options]')
	.description('Monorepo scaffolding for Svelte and TypeScript projects')
	.argument('[directory]', 'Directory to create the project in')
	.option('--force', 'Overwrite existing files', false)
	.parse(process.argv);

const dir = program.args[0] || './';
const settings = await getSettings(program.opts());
await createRoot(dir, settings);

console.log(settings);
