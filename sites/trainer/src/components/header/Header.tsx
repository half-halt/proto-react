import { FunctionComponent } from "react";
import { useService } from "@hhf/services";
import { BehaviorSubject } from "rxjs";
import { useObservable } from "@hhf/rx";
import { HeaderAction } from "./HeaderAction";
import './header.scss';
import { useEffect } from "react";

export type ActionInfo = {
	text: string,
	path?: string,
	handler?: () => void,
}

export class HeaderService {
	public title = new BehaviorSubject('');
	public actions = new BehaviorSubject<ActionInfo[]>([]);

	setTitle(title?: string) {
		this.title.next(title || '');
	}

	setActions(actions?: ActionInfo[]) {
		this.actions.next(actions || []);
	}
}

export const Header: FunctionComponent = () => {
	const headerService = useService(HeaderService);
	const title = useObservable(headerService.title);
	const actions = useObservable(headerService.actions);

	// Update the document title.
	useEffect(() => {
		if (title) {
			document.title = `${title} - Trainer`;
		} else {
			document.title = 'Trainer';
		}
	}, [title])

	return (
		<header className="trainerHeader">
			<h1>{title ? title : 'Home'}</h1>
			{Array.isArray(actions) && (actions.length !== 0) && 
				<ul className="headerActions">
					{actions.map(action => <HeaderAction action={action}/>)}
				</ul>
			}
		</header>
	)
}
