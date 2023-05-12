import chalk from 'chalk';

export class Announcer {
	private static _nextMessageNumber = 1;

	static info(message: string, isSerial = true): void {
		const text = isSerial ? `${this._nextMessageNumber++}. ${message}` : message;
		console.log(chalk.blue.bold(text));
	}
}
