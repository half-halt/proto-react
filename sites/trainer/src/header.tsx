import { FunctionalComponent } from "preact";
import "./header.css";

interface HeaderProps {
	text?: String;
}

export const Header: FunctionalComponent<HeaderProps> = ({ text }) => {
	return (
		<header class="header">
			<h1>{text || ''}</h1>
		</header>
	);
}