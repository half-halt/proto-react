import { FunctionalComponent } from "preact";
import { Link } from 'preact-router';

interface HeaderActionProps {
	action: {
		text: string;
		path?: string;
		handler?: () => void;
	}
}

export const HeaderAction: FunctionalComponent<HeaderActionProps> = ({
	action
}) => {
	if (typeof(action.path) === 'string') {
		return (
			<Link href={action.path}>{action.text}</Link>
		);
	} else if (action.handler && (typeof(action.handler) === 'function')) {
		return (
			<button onClick={() => action.handler!()}>{action.text}</button>
		);
	}
	
	// Throw a new error here.
	return null;
}