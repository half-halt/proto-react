import { FunctionComponent, isValidElement, VNode } from "preact";
import { Link } from "preact-router/match";
import "./navigation.scss";

type Destination = {
	path: string,
	text: string,
	icon?: string
}

interface DrawerProps {
	header?: VNode<any> | Element;
	destinations?: Destination[];
}

export const Drawer: FunctionComponent<DrawerProps> = ({
	header,
	destinations
}) => {
	return (
		<nav class="navigationDrawer">
			{isValidElement(header) && header}
			{Array.isArray(destinations) &&
				<ul class="navigationItems">
					{destinations.map(destination => (
						<li>
							<Link activeClassName="activeLink" href={destination.path}>{destination.text}</Link>
						</li>						
					))}
				</ul>
			}
		</nav>
	)	
}