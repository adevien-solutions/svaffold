import path from 'path';
import { argv } from 'process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { Archetype, Settings } from '../types.js';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { getStdioSetting, replaceInFile, stringify } from '../utils.js';

export function createCmsProject(dir: string, settings: Settings): void {
	const { client } = settings;
	const root = dir;
	dir = path.join(dir, 'projects');
	existsSync(dir) || mkdirSync(dir, { recursive: true });
	process.chdir(dir);

	if (settings.cms === 'payload') {
		const db = `mongodb://127.0.0.1/${client}-${Archetype.cms}`;
		execSync(
			`npx create-payload-app --name ${Archetype.cms} --template blank --db ${db} --no-deps`,
			{ stdio: getStdioSetting(settings) }
		);
		if (process.send) {
			process.send(`Payload will try to connect to a local MongoDB instance at ${chalk.green(db)}
You can change this by updating ${chalk.green('MONGODB_URI')} in ${chalk.green(
				path.join(root, '.env')
			)}`);
		}
		const packageJson = JSON.parse(readFileSync(`${Archetype.cms}/package.json`, 'utf-8'));
		packageJson.name = `@${client}/${Archetype.cms}`;
		packageJson.version = '0.0.1';
		packageJson.scripts['preview'] = packageJson.scripts.serve;
		delete packageJson.scripts.serve;
		delete packageJson.description;
		writeFileSync(`${Archetype.cms}/package.json`, stringify(packageJson));
		writeFileSync(`${Archetype.cms}/README.md`, `# @${client}/${Archetype.cms}\n`);
		replaceInFile(`${Archetype.cms}/Dockerfile`, '3000', '80', true);
		replaceInFile(`${Archetype.cms}/docker-compose.yml`, '3000', '80', true);
		const env = readFileSync(`${Archetype.cms}/.env`, 'utf-8');
		appendFileSync(`${root}/.env`, `${env}\n`);
		rmSync(`${Archetype.cms}/.env`);
	}

	process.exit();
}

createCmsProject(argv[2], JSON.parse(argv[3]));
