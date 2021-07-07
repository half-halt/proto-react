import { Subject } from "rxjs";
import { serviceManagerInstance } from "../instance";

export interface LogEntry {
	level: "info" | "warning" | "error";
	text: string;
}

export class LogService {
	public messages = new Subject<LogEntry[]>();
	private _entries: LogEntry[] = [];

	private add(level: LogEntry["level"], message: string, args: unknown[]) {
		let result = message;
		if (args &&  args.length !== 0) {
			args.forEach((arg, index) => {
				result = result.replace(`{${index}}`, String(arg));
			});
		}
		
		if (this._entries.length >= 30) {
			this._entries.pop()
		}

		this._entries = [({
			level,
			text: result
		})].concat(this._entries);

		this.messages.next(this._entries);

		switch (level) {
			case 'error':
				console.error(result);
				break;

			case 'warning':
				console.warn(result);
				break;

			default:
				console.log(result);
				break;
		}
	}

	log(message: string, ...args: unknown[]) {
		this.add("info", message, args);
	}

	warning(message: string, ...args: unknown[]) {
		this.add("warning", message, args);
	}

	error(message: string, ...args: unknown[]) {
		this.add("error", message, args);
	}
}

const instance = serviceManagerInstance.get(LogService);
export { instance as logService };