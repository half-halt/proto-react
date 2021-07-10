import { FunctionComponent, isValidElement, ComponentType, ReactElement } from "react";
import { NavLink as Link } from "react-router-dom";
import "./navigation.scss";

type Destination = {
	path: string,
	text: string,
	icon?: string
}

interface DrawerProps {
	header?: ComponentType<any> | Element | ReactElement<any, any>;
	destinations?: Destination[];
}

export const Drawer: FunctionComponent<DrawerProps> = ({
	header,
	destinations
}) => {
	return (
		<nav className="navigationDrawer">
			{isValidElement(header) && header}
			{Array.isArray(destinations) &&
				<ul className="navigationItems">
					{destinations.map(destination => (
						<li>
							<Link activeClassName="activeLink" to={destination.path}>{destination.text}</Link>
						</li>						
					))}
				</ul>
			}
		</nav>
	)	
}