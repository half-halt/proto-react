import { atom } from "recoil";
import { UseAuthentication } from "./context";

// Holds information about the state of authentication
export const authState = atom<boolean>({
	key: 'authState',
	default: true,
});

// Holds information about shwoing the logins tate.
export const showLoginState = atom<boolean>({
	key: 'showLoginState',
	default: false,
});