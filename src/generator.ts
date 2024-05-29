import chalk from 'chalk';
import { spawn } from 'child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { Announcer } from './announcer.js';
import {
	getDockerfileContent,
	getDockerignoreContent,
	getGitignoreContent,
	getPackageJsonContent,
	getPnpmWorkspaceYamlContent,
	getPrettierignoreContent,
	getPrettierrcContent,
	getReadmeMdContent,
	getTurboJsonContent
} from './files/index.js';
import { getAssetsSyncYmlContent, getPublishSvelteYmlContent } from './files/workflows/index.js';
import { AllSettings, Archetype, Settings } from './types.js';
import {
	createProcessForkPromise,
	getStdioSetting,
	isRepoOnGitHub,
	isSvelteType
} from './utils.js';

export class Generator {
	/** Root where the CLI got called */
	readonly root: string;
	/** Directory where the monorepo will be created */
	readonly dir: string;
	readonly settings: AllSettings;

	constructor(dir: string, settings: Settings) {
		this.root = process.cwd();
		this.dir = path.join(this.root, path.normalize(dir));
		this.settings = { ...settings, dir: this.dir, root: this.root };
		if (isRepoOnGitHub(this.settings.repoUrl) && !this.settings.repoUrl.endsWith('.git')) {
			this.settings.repoUrl = `${this.settings.repoUrl}.git`;
		}
	}

	async init(): Promise<Generator> {
		try {
			await this._createFiles();
			await this._installDependencies();
			await this._synSvelteProjects();
			await this._initializeGit();
			Announcer.finish();
			return this;
		} catch (error: unknown) {
			this._cleanUpAfterError(error);
			return this;
		}
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
			'turbo.json': getTurboJsonContent(this.settings)
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
				// This refers to the local source file, it's not a generated one
				file = `./projects/svelte.js`;
				args = [type, this.dir, JSON.stringify(this.settings)];
			} else {
				file = `./projects/${type}.js`;
				args = [this.dir, JSON.stringify(this.settings)];
			}
			return createProcessForkPromise(file, args);
		});
		return await Promise.all(promises);
	}

	private async _installDependencies(): Promise<void> {
		Announcer.info('Installing dependencies (this might take a few minutes)');
		// TODO: run preinstall adders like "histoire"
		await new Promise((resolve) => {
			const proc = spawn('pnpm', ['install'], {
				cwd: this.dir,
				shell: true,
				stdio: getStdioSetting(this.settings)
			});
			proc.once('exit', resolve);
		});
		await this._runPostInstallAdders();
	}

	private async _runPostInstallAdders(): Promise<void[]> {
		const promises = [
			createProcessForkPromise('./adders/lib-builder.js', [this.dir, JSON.stringify(this.settings)])
		];
		return await Promise.all(promises);
	}

	private async _synSvelteProjects(): Promise<void[] | void> {
		const apps = this.settings.archetypes.filter(isSvelteType);
		if (apps.length === 0) {
			return;
		}
		Announcer.info('Syncing Svelte projects');
		const promises = apps.map((type) => {
			return createProcessForkPromise('./adders/svelte-sync.js', [type, this.dir]);
		});
		return await Promise.all(promises);
	}

	private async _initializeGit(): Promise<void> {
		Announcer.info('Initializing git');
		return new Promise<void>((resolve) => {
			let command = 'git init';
			if (this.settings.repoUrl) {
				command += ` && git add . && git commit -m "feat: initial commit" && git branch -M main && git remote add origin ${this.settings.repoUrl} && git push -u origin main`;
			}
			const proc = spawn(command, {
				cwd: this.dir,
				stdio: getStdioSetting(this.settings),
				shell: true
			});
			proc.once('exit', resolve);
		});
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

	private _cleanUpAfterError(error: unknown): void {
		rmSync(this.dir, { recursive: true });
		const message = `An error occurred during the scaffolding. The created files are cleaned up.


The original error message was:

${error instanceof Error ? error.message : String(error)}}`;
		Announcer.error(message);
	}
}
