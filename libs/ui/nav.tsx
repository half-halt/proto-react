import { FunctionalComponent } from "preact";
import { Link } from "preact-router/match";

export const Navigation: FunctionalComponent = () => {
	return (
		<nav>
			<p>Navigation</p>
			<Link class="mainLink" href="/" activeClassName="active">Some Link</Link>
		</nav>
	);
}