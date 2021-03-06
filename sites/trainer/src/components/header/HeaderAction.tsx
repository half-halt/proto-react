import { FunctionComponent } from "react";
import { NavLink as Link } from 'react-router-dom';

interface HeaderActionProps {
	action: {
		text: string;
		path?: string;
		handler?: () => void;
	}
}

export const HeaderAction: FunctionComponent<HeaderActionProps> = ({
	action
}) => {
	if (typeof(action.path) === 'string') {
		return (
			<Link to={action.path}>{action.text}</Link>
		);
	} else if (action.handler && (typeof(action.handler) === 'function')) {
		return (
			<button onClick={() => action.handler!()}>{action.text}</button>
		);
	}
	
	// Throw a new error here.
	return null;
}