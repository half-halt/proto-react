import { UseAuthentication, User } from "./context";
import { LogService, OnStartup, registerStartup } from "@hhf/services";
import { BehaviorSubject, of } from "rxjs";
import { Client, query } from 'faunadb';
const USER_KEY = 'user-token';

export class AuthenticationService implements UseAuthentication, OnStartup {
	static Dependencies = [LogService];
	public user = new BehaviorSubject<User | null>(null);

	constructor(
		private logger: LogService
	) {}

	onStartup() {
		this.user.next(null);

		const localItem = localStorage.getItem(USER_KEY);
		if (typeof(localItem) === 'string') {
			try {
				const user = JSON.parse(localItem) as User;
				this.user.next(user);
				this.logger.log('Using cached user information for "{0}"', user.email)
				return of(true);
			} catch (error: any) {
				this.logger.error('Failed to parse store user information: {0}', error.message);
			}
		}

		return of(true);
	}

	isAuthenticated(): boolean {
		const user = this.getUser();
		return (user !== null) && (typeof(user.token) === 'string');
	}

	getUser(): User | null {
		return this.user.getValue();
	}

	hasRole(role: string | string[]): boolean {
		const user = this.getUser();
		if (user) {
			if (typeof(role) === 'string') {
				return user.roles.includes(role);
			} else if (Array.isArray(role)) {
				return role.some(r => user.roles.includes(r));
			}
		}

		return false;
	}

	login(email: string, password: string): Promise<User> {
		const client = new Client({ secret: 'fnAEOsZ6N6ACQliObgVyE2hewJrx9MNzD_6TWP5p' });
		
		this.logger.log('Starting login of "{0}"', email);
		return client.query<User>(query.Call('UserLogin', email, password)).then(
			(user) => {
				this.user.next(user);
				localStorage.setItem(USER_KEY, JSON.stringify(user));
				return Promise.resolve(user);
			},
			(error) => {
				localStorage.removeItem(USER_KEY);
				this.user.next(null);
				return Promise.reject(error);
			}
		);
	}

	logout(): Promise<boolean> {
		const user = this.getUser();
		localStorage.removeItem(USER_KEY);		
		this.user.next(null);
		
		if (user) {
			// call the server to sign-out the user here	
		}

		return Promise.resolve(true);
	}
}

registerStartup(AuthenticationService);