import { FC } from "react";
import { Authentication } from "@hhf/auth";
import { Themed } from "@hhf/theme";

export const AdminApp: FC = () => {
	return (
		<Themed>
			<Authentication require>
				<div>
					admin
				</div>
			</Authentication>
		</Themed>		
	)
}