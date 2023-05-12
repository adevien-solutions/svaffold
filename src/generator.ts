import chalk from 'chalk';
import { fork } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { Announcer } from './announcer.js';
import {
	getGitignoreContent,
	getPrettierignoreContent,
	getPrettierrcContent,
	getDockerfileContent,
	getPackageJsonContent,
	getPnpmWorkspaceYamlContent,
	getReadmeMdContent,
	getTurboJsonContent
} from './files/index.js';
import { Settings } from './types.js';

export class Generator {
	/** Root where the CLI got called */
	readonly root: string;
	/** Directory where the monorepo will be created */
	readonly dir: string;
	readonly settings: Settings;

	constructor(dir: string, settings: Settings) {
		this.root = process.cwd();
		this.dir = path.join(this.root, path.normalize(dir));
		this.settings = settings;
	}

	async init(): Promise<Generator> {
		await this._createFiles();
		await this._installDependencies();
		await this._initializeGit();
		return this;
	}

	private async _createFiles(): Promise<void> {
		Announcer.info('Creating files');
		this._createRoot();
		await this._createProjects();
	}

	private _createRoot(): void {
		const root = process.cwd();
		existsSync(this.dir) || mkdirSync(this.dir, { recursive: true });
		process.chdir(this.dir);
		const files = {
			'.gitignore': getGitignoreContent(),
			'.prettierignore': getPrettierignoreContent(),
			'.prettierrc': getPrettierrcContent(),
			Dockerfile: getDockerfileContent(),
			'package.json': getPackageJsonContent(this.settings),
			'pnpm-workspace.yaml': getPnpmWorkspaceYamlContent(this.settings),
			'README.md': getReadmeMdContent(this.settings),
			'turbo.json': getTurboJsonContent()
		};
		Object.entries(files).forEach(([path, content]) => this._checkAndWriteFile(path, content));
		process.chdir(root);
	}

	private async _createProjects(): Promise<void[]> {
		const promises = this.settings.archetypes.map((type) => {
			return new Promise<void>((resolve) => {
				const proc = fork(`./dist/projects/${type}.js`, [this.dir, JSON.stringify(this.settings)]);
				proc.once('exit', resolve);
			});
		});
		return await Promise.all(promises);
	}

	private async _installDependencies(): Promise<void> {
		Announcer.info('Installing dependencies');
	}

	private async _initializeGit(): Promise<void> {
		Announcer.info('Initializing git');
	}

	private _checkAndWriteFile(path: string, content: string): void {
		if (!this.settings.options.force && existsSync(path)) {
			const highlight = chalk.green(path);
			const force = chalk.yellow('--force');
			console.log(
				`Skipping ${highlight} as it already exists. Use ${force} to overwrite existing files.`
			);
		} else {
			writeFileSync(path, content);
		}
	}
}
