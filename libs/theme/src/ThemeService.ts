import { BehaviorSubject } from 'rxjs';
import { OnStartup, LogService, useService } from "@hhf/services";
import { defaultTheme } from '../themes/default';

type Theme = Record<string, unknown> & { id: string };
const STORAGE_KEY = 'hhf:theme-id';
const EMPTY_THEME = { id: 'empty' };

export class ThemeService implements OnStartup {
	static Dependencies = [LogService];
	public currentTheme = new BehaviorSubject<Theme>(EMPTY_THEME);
	private _available: Theme[] = [];

	constructor(
		private logger: LogService
	) {}	

	setAvailableThemes(themes: Theme[]) {
		this._available = themes;
	}

	setTheme(theme: string) {
		const newTheme = this._available.find(t => (t.id === theme));
		if (newTheme) {
			const current = this.currentTheme.getValue();
			this.logger.log('ThemeService: changed theme from "{0}" to "{1}"', current.id, newTheme.id);
			localStorage.setItem(STORAGE_KEY, (newTheme.id as string));
			this.currentTheme.next(newTheme);
		}
	}

	get theme() {
		return this.currentTheme.getValue()
	}

	get availabeThemes() {
		return this._available.map(theme => theme.id);
	}

	onStartup() {
		// Check local storage for a saved theme, if we have one (and it still exists)
		// then set our theme to be that one, otherwise we leave it set to the default.

		let theme: Theme|undefined;
		const themeId = localStorage.getItem(STORAGE_KEY);
		if (typeof(themeId) === 'string') {
			theme = this._available.find(theme => theme.id === themeId);
		}

		// More logic here to determine if they prefer a dark theme?
		if (!theme) {
			theme = this._available[0] || defaultTheme;
		}

		this.logger.log('ThemeService: setting startup theme "{0}".', theme.id);
		this.currentTheme.next(theme);
	}
}

export function useThemeService() {
	return useService(ThemeService);
}