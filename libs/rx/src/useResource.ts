import { useEffect, useState } from "react";
import { Observable } from "rxjs";

type UseResource<T> = {
	data?: T,
	loading: boolean,
	error?: Error,
}

type ResourceFunction<T> = (...args: any[]) => Observable<T>;

/**
 * A hook which subscribes to the provided observable emits loading/error
 * states as well as the data itself.
 * 
 * @param resource A function which emits an observable which resolves to the resource
 * @param args The arguments to the functions
 */
export function useResource<T>(resource: ResourceFunction<T>, ...args: Parameters<typeof resource>): UseResource<T> {
	const [state, setState] = useState<UseResource<T>>({ loading: true });

	useEffect(() => {
		setState({ loading: true });
		try {
			const observable = resource.call(null, ...args);

			const subscription = observable.subscribe({
				next: (data: T) => {
					setState({ loading: false, data });
				},
				error: (error: Error) => {
					setState({ loading: false, error })
				}
			});

			return () => {
				subscription.unsubscribe();
			}
		} catch (error) {
			setState({ loading: false, error: error as Error });
		}
	}, [])

	return state;
}