import { useObservable } from "@hhf/rx";
import { getService } from "@hhf/services";
import { Children, cloneElement, createElement, FC, isValidElement, PropsWithChildren, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AuthenticationService } from "./AuthenticationService";
import { authState, showLoginState } from "./authState";
import { authContext } from "./context";
import { LoginForm } from "./LoginForm";
const authService = getService(AuthenticationService);

interface AuthenticationProps {
	require?: boolean
}

export const Authentication: FC<PropsWithChildren<AuthenticationProps>> = ({
	children,
	require
}) => {
	const user = useObservable(authService.user);
	console.log('user:', user, authService);

	return (
		<authContext.Provider value={{} as any}>
			{user &&
				Children.map(children, child => isValidElement(child) ? cloneElement(child, {}) : child)
			}
			{!user &&
				<div className="authContainer">
					<LoginForm/>
				</div>
			}
		</authContext.Provider>
	)
}