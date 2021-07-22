import { Children, cloneElement, createElement, FC, isValidElement, PropsWithChildren, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState, showLoginState } from "./authState";
import { authContext } from "./context";
import { LoginForm } from "./LoginForm";

interface AuthenticationProps {
	require?: boolean
}

export const Authentication: FC<PropsWithChildren<AuthenticationProps>> = ({
	children,
	require
}) => {
	const state = useRecoilValue(authState);
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (require && !state.isAuthenticated) {
			setShow(true);
		}
	}, [require, state]);

	return (
		<authContext.Provider value={state}>
			{!show && state.isReady &&
				Children.map(children, child => isValidElement(child) ? cloneElement(child, {}) : child)
			}
			{show &&
				<div className="authContainer">
					<LoginForm/>
				</div>
			}
		</authContext.Provider>
	)
}