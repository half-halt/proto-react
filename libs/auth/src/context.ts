import { createContext} from "react";

export interface UseAuthentication {
	isReady: boolean;
	inProgress: boolean;
	isAuthenticated: boolean;
	token?: string;
	roles?: string[];
	email?: string;
	name?: string;
};

export const authContext = createContext<UseAuthentication | null>(null);