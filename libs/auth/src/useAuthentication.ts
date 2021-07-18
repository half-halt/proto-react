import { useContext } from "react";
import { authContext, UseAuthentication } from "./context";

export function useAuthentication(): UseAuthentication {
	const context = useContext(authContext);
	if (!context) {
		throw new Error('useAuthentication must appear under a <Authentication/> element');
	}

	return context;
}