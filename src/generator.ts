import chalk from 'chalk';
import { execSync, fork } from 'child_process';
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
	getTurboJsonContent,
	getDockerignoreContent
} from './files/index.js';
import { getPublishSvelteYmlContent, getAssetsSyncYmlContent } from './files/workflows/index.js';
import { Archetype, Settings } from './types.js';
import { getDirName, isRepoOnGitHub, isSvelteType } from './utils.js';

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
		this._installDependencies();
		this._initializeGit();
		Announcer.finish();
		return this;
	}

	private async _createFiles(): Promise<void> {
		Announcer.info('Creating files');
		await this._createRoot();
		await this._createWorkflows();
		await this._createProjects();
	}

	private async _createRoot(): Promise<void> {
		const root = process.cwd();
		existsSync(this.dir) || mkdirSync(this.dir, { recursive: true });
		process.chdir(this.dir);
		const files = {
			'.dockerignore': getDockerignoreContent(),
			'.env': '',
			'.gitignore': getGitignoreContent(),
			'.prettierignore': getPrettierignoreContent(),
			'.prettierrc': getPrettierrcContent(),
			Dockerfile: getDockerfileContent(),
			'package.json': await getPackageJsonContent(this.settings),
			'pnpm-workspace.yaml': getPnpmWorkspaceYamlContent(this.settings),
			'README.md': getReadmeMdContent(this.settings),
			'turbo.json': getTurboJsonContent()
		};
		Object.entries(files).forEach(([path, content]) => this._checkAndWriteFile(path, content));
		process.chdir(root);
	}

	private async _createWorkflows(): Promise<void> {
		const apps = this.settings.archetypes.filter(isSvelteType);
		const isAssetsSelected = this.settings.archetypes.includes(Archetype.assets);
		if (!isRepoOnGitHub(this.settings.repoUrl) || (apps.length === 0 && !isAssetsSelected)) {
			return;
		}

		const root = process.cwd();
		const folder = path.join(this.dir, '.github', 'workflows');
		existsSync(folder) || mkdirSync(folder, { recursive: true });
		process.chdir(folder);

		apps.forEach((type) => {
			writeFileSync(`publish-${type}.yml`, getPublishSvelteYmlContent(this.settings, type));
		});
		if (isAssetsSelected) {
			writeFileSync(`sync-assets.yml`, getAssetsSyncYmlContent(this.settings));
		}

		process.chdir(root);
	}

	private async _createProjects(): Promise<void[]> {
		const promises = this.settings.archetypes.map((type) => {
			let file = '';
			let args: string[] = [];
			if (isSvelteType(type)) {
				file = `./projects/svelte.js`;
				args = [type, this.dir, JSON.stringify(this.settings)];
			} else {
				file = `./projects/${type}.js`;
				args = [this.dir, JSON.stringify(this.settings)];
			}
			return new Promise<void>((resolve) => {
				const proc = fork(path.join(getDirName(import.meta.url), file), args);
				proc.on('message', (message) => Announcer.addDelayedMessage(message.toString()));
				proc.once('exit', resolve);
			});
		});
		return await Promise.all(promises);
	}

	private _installDependencies(): void {
		Announcer.info('Installing dependencies');
		process.chdir(this.dir);
		execSync('pnpm install');
	}

	private _initializeGit(): void {
		Announcer.info('Initializing git');
		process.chdir(this.dir);
		execSync('git init');
		if (!this.settings.repoUrl) {
			return;
		}
		execSync('git add .');
		execSync('git commit -m "feat: initial commit"');
		execSync('git branch -M main');
		execSync(`git remote add origin ${this.settings.repoUrl}`);
		execSync('git push -u origin main');
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
