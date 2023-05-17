#! /usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getSettings } from './utils.js';
import { Generator } from './generator.js';

const VERSION_NUMBER = '1.0.7';
const program = new Command();

program
	.version(VERSION_NUMBER)
	.usage('npx @adevien/svelte-scaffold [options]')
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
