import { FunctionalComponent } from "preact";
import { useService } from "@hhf/services";
import { BehaviorSubject } from "rxjs";
import { useObservable } from "@hhf/rx";
import { HeaderAction } from "./HeaderAction";
import './header.scss';
import { useEffect } from "preact/hooks";

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

export const Header: FunctionalComponent = () => {
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
		<header class="trainerHeader">
			<h1>{title ? title : 'Home'}</h1>
			{Array.isArray(actions) && (actions.length !== 0) && 
				<ul class="headerActions">
					{actions.map(action => <HeaderAction action={action}/>)}
				</ul>
			}
		</header>
	)
}
