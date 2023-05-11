import { existsSync, mkdirSync } from 'fs';
import { argv } from 'process';

async function proc(idJson: string): Promise<void> {
	const { id } = JSON.parse(idJson);
	console.log(JSON.parse(idJson));
	console.log(`pid: ${process.pid}`);
	const root = process.cwd();
	console.log(`process ${id} started from '${root}'`);
	const dir = 'folder' + id;
	existsSync(dir) || mkdirSync(dir);
	const ms = +id * 1000;
	await setTimeout(() => {
		console.log(`waited ${ms} ms`);
		process.exit();
	}, ms);
	mkdirSync(dir + '/sub');
}

proc(argv[2]);
