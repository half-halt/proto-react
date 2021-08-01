import { AuthenticationService } from "@hhf/auth";
import { useService } from "@hhf/services";
import { FC, PropsWithChildren, useEffect } from "react";
import "./AreaHeader.scss";

interface AreaHeaderProps {
	title?: string;
}

export const AreaHeader: FC<PropsWithChildren<AreaHeaderProps>> = ({
	title,
	children
}) => {
	const authService = useService(AuthenticationService);

	useEffect(() => {
		if (title && (typeof(title) === 'string')) {
			document.title = title.concat(' - HHF Admin');
		} else {
			document.title = 'HHF Admin';
		}
	}, [title])

	return (
		<header id="areaHeader" className="hhfAreaHeader">
			<h1>{title || 'Admin'}</h1>
			<div id="actions">
				{children}
			</div>
			<div id="auth">
				{`${authService.getUser()?.name} (${authService.getUser()?.email})`}
			</div>
		</header>
	);
}