import { useRef, useState } from "react";
import { Observable } from "rxjs";

export function useLoadingObservable() {
	const observableRef = useRef<Observable<any> | null>(null);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<Error|undefined>();

	const set = (observable: Observable<any>) => {
		observableRef.current = observable;
		observable.subscribe(
			() => {
				setError(undefined);
				setPending(false);
			},
			(error) => {
				setError(error);
				setPending(false);
			}
		);
		setPending(true);
	}

	return {
		loading: (pending === true),
		error: (error || null),
		watch: set
	};
}
