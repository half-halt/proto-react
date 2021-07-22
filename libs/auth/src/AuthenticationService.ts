import { UseAuthentication, User } from "./context";
import { LogService, OnStartup } from "@hhf/services";

class AuthenticationService implements UseAuthentication, OnStartup {
	static Dependencies = [LogService];

	constructor(
		private logger: LogService
	) {}

	onStartup(): unknown {
		throw new Error("Method not implemented.");
	}
	isAuthenticated(): boolean {
		throw new Error("Method not implemented.");
	}
	getUser(): User | null {
		throw new Error("Method not implemented.");
	}
	hasRole(role: string | string[]): boolean {
		throw new Error("Method not implemented.");
	}
	login(email: string, password: string): Promise<User> {
		throw new Error("Method not implemented.");
	}
	logout(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	
}