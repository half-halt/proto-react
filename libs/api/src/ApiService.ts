import { OnShutdown, OnStartup, registerStartup } from "@hhf/services";
import { Client } from "faunadb";
import { AuthenticationService } from "@hhf/auth";
import { Subscription } from "rxjs";

export class ApiService implements OnShutdown {
	static Dependencies = [AuthenticationService];
	private _subscription?: Subscription;
	private _client: Client;

	constructor(
		private authService: AuthenticationService
	) {
		this._client = new Client({ secret: 'fnAEOsZ6N6ACQliObgVyE2hewJrx9MNzD_6TWP5p' });

		this.authService.user.subscribe(
			(user) => {
				if (user) {
					this._client = new Client({ secret: user.token });
				} else {
					this._client = new Client({ secret: 'fnAEOsZ6N6ACQliObgVyE2hewJrx9MNzD_6TWP5p' });
				}
			}
		)
	}

	onShutdown() {
		if (this._subscription) {
			this._subscription.unsubscribe();
			this._subscription = undefined;
		}
	}	

	getClient() {
		return this._client;
	}
}