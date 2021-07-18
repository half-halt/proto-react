import { Children, FC, PropsWithChildren, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "./authState";
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
	}, [require]);

	return (
		<authContext.Provider value={state}>
			{!show && state.isReady &&
				{children}
			}
			{show &&
				<div className="authContainer">
					<LoginForm/>
				</div>
			}
		</authContext.Provider>
	)
}