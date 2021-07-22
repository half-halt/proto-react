import { createContext} from "react";

export interface User {
	token: string;
	roles: string[];
	email: string;
	name?: string;
}

export interface UseAuthentication {
	isAuthenticated(): boolean;
	getUser(): User | null;
	hasRole(role: string | string[]): boolean;
	login(email: string, password: string): Promise<User>;
	logout(): Promise<boolean>;
};

export const authContext = createContext<UseAuthentication | null>(null);