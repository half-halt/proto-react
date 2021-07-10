import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

export const Navigation: FunctionComponent = () => {
	return (
		<nav>
			<p>Navigation</p>
			<Link className="mainLink" to="/">Some Link</Link>
		</nav>
	);
}