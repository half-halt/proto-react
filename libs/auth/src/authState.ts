import { atom } from "recoil";
import { UseAuthentication } from "./context";

export const authState = atom<UseAuthentication>({
	key: 'authState',
	default: {
		inProgress: false,
		isAuthenticated: false,
		isReady: true,
	}
})