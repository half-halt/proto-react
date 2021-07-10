import { FunctionComponent } from "react";
import "./header.css";

interface HeaderProps {
	text?: String;
}

export const Header: FunctionComponent<HeaderProps> = ({ text }) => {
	return (
		<header className="header">
			<h1>{text || ''}</h1>
		</header>
	);
}