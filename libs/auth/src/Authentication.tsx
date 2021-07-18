import { FC, PropsWithChildren } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "./authState";
import { authContext } from "./context";

export const Authentication: FC<PropsWithChildren<{}>> = ({
	children
}) => {
	const state = useRecoilValue(authState);

	return (
		<authContext.Provider value={state}>
			{state.isReady &&
				{children}
			}
		</authContext.Provider>
	)
}