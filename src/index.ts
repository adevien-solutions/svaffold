#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { Generator } from './generator.js';
import { getSettings } from './utils.js';

const VERSION_NUMBER = '3.0.0';
const program = new Command();

program
	.version(VERSION_NUMBER)
	.usage('npx svaffold [options]')
	.description(
		chalk.bold(
			`Monorepo scaffolding for ${chalk.hex('#ff3e00')('Svelte')} and ${chalk.hex('#2f73bf')(
				'TypeScript'
			)} projects`
		)
	)
	.argument('<directory>', 'root of the monorepo')
	.option('--force', 'overwrite existing files', false)
	.option('--verbose', 'output the messages of subprocesses', false)
	.parse(process.argv);

const settings = await getSettings(program.opts());
await new Generator(program.args[0], settings).init();
