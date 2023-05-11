import chalk from 'chalk';

export class Announcer {
	private static _nextMessageNumber = 1;

	static serialInfo(message: string): void {
		console.log(chalk.blue.bold(`${this._nextMessageNumber++}. ${message}`));
	}
}
