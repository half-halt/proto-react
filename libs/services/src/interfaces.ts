import { Observable } from "rxjs";

/**
 * Interface which is invoked during a service startup.
 */
export interface OnStartup {
	onStartup(): Promise<unknown> | Observable<unknown> | unknown | undefined | void;
}

/**
 * Interface which is invoked during a service startup.
 */
export interface OnShutdown {
	onShutdown(): unknown;
}