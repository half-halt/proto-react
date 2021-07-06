import { forkJoin, Observable, of } from "rxjs";

interface ServiceEntry {
	service: any;
	ts: number;
	startup?: boolean | undefined;	
}

type ServiceType<T> = new (...deps: any[]) => T;

export class ServiceManager {
	private _services = new Map<string, ServiceEntry>();
	private _initialized = false;
	private _terminated = true;

	private createEntry<T>(serviceType: ServiceType<T>, startup?: boolean): ServiceEntry {	
		const serviceDeps = ((serviceType as any).Dependencies || []) as ServiceType<unknown>[];
		const args = serviceDeps.map(service => {
			return this.get(service);
		});

		const service = new serviceType(...args) as any;
		const entry = {
			service,
			ts: Date.now(),
			startup: startup,
		};

		return entry;
	}

	registerStartup<T>(serviceType: ServiceType<T>) {
		console.assert(this._services.get(serviceType.name) === undefined);
		console.assert(!this._initialized, "The ServiceManager has already been initialized");

		const entry = this.createEntry(serviceType, true);
		this._services.set(serviceType.name, entry);
		return entry.service as T;
	}

	get<T, I = T>(serviceType: ServiceType<T>): I {
		const serviceName = serviceType.name;
		let entry = this._services.get(serviceName);

		if (entry) {
			entry.ts = Date.now();
		} else {
			entry = this.createEntry(serviceType, false);
			this._services.set(serviceName, entry);
		}

		return entry.service as I;
	}

	startup(): Observable<any> {
		console.assert(!this._initialized, "The ServiceManager has already been initialized");

		const tasks: Observable<unknown>[] = [];
		this._initialized = true;
		this._terminated = false;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const [_name, entry] of this._services.entries()) {
			// Is this a startup service?
			if (entry.startup !== true) {
				continue;
			}

			if (typeof(entry.service.onStartup) !== "function") {
				continue;
			}

			const result = entry.service.onStartup();
			if (result instanceof Observable) {
				tasks.push(result);
			}
		}

		if (tasks.length !== 0) {
			return forkJoin(tasks);
		}

		return of(true);
	}
	
	shutdown() {
		if (!this._terminated) {
			this._terminated = true;
			this._initialized = false;
			this._services.clear();
		}
	}
}