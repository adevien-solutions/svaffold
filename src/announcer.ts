import chalk from 'chalk';
import ora, { Ora } from 'ora';
import spinners from 'cli-spinners';

export class Announcer {
	private static _nextMessageNumber = 1;
	private static _lastOraInstance: Ora | null = null;
	private static _delayedMessages: Set<string> = new Set();

	static info(message: string, isSerial = true, spinner = true): void {
		this.stopSpinner();
		message = isSerial ? `${this._nextMessageNumber++}. ${message}` : message;
		if (this._nextMessageNumber === 2) {
			console.log('\n');
		}
		const text = chalk.blue.bold(message);
		if (spinner) {
			this._lastOraInstance = ora({ text, spinner: spinners.squareCorners, color: 'blue' }).start();
		} else {
			console.log(text);
		}
	}

	/** Add messages which will be displayed when the `finish` method is called. */
	static addDelayedMessage(message: string): void {
		this._delayedMessages.add(message);
	}

	static stopSpinner(): void {
		if (this._lastOraInstance) {
			this._lastOraInstance.succeed();
			this._lastOraInstance = null;
		}
	}

	static finish(): void {
		this.stopSpinner();
		if (this._delayedMessages.size > 0) {
			console.log(chalk.cyan.bold('\nInfos for your monorepo:'));
			this._delayedMessages.forEach((message) => console.log(message + '\n'));
			this._delayedMessages = new Set();
		}
	}
}
