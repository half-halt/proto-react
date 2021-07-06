import { BehaviorSubject } from 'rxjs';
import { defaultTheme } from '../themes/default';
interface OnStartup {
	onStartup(): unknown;
}

type Theme = Record<string, unknown>;
const STORAGE_KEY = 'hhf:theme-id';
const EMPTY_THEME = {};

export class ThemeService implements OnStartup {
	//static Dependencies = [LogService];
	public currentTheme = new BehaviorSubject<Theme>(EMPTY_THEME);
	private _available: Theme[] = [];

	constructor(
		//private logger: LogService
		themes: Theme[],
	) {
		this._available = themes;
	}	

	setTheme(theme: string) {
		const newTheme = this._available.find(t => (t.id === theme));
		if (newTheme) {
			//this.logger.log('Theme changed from "{0}" to "{1}"', this._currentTheme, theme);
			this.currentTheme.next(newTheme);
			localStorage.setItem(STORAGE_KEY, (newTheme.id as string));
		}
	}

	get theme() {
		return this.currentTheme.getValue()
	}

	onStartup() {
		// Check local storage for a saved theme, if we have one (and it still exists)
		// then set our theme to be that one, otherwise we leave it set to the default.

		const themeId = localStorage.getItem(STORAGE_KEY);
		if (typeof(themeId) === 'string') {
			const theme = this._available.find(theme => theme.id === themeId);
			if (theme) {
				this.currentTheme.next(theme);
				return;
			}
		}

		this.currentTheme.next(this._available[0]);
	}
}

const i = new ThemeService([defaultTheme]);
i.onStartup();

export function useThemeService() {
	return i;
}