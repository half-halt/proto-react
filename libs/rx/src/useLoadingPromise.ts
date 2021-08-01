import { useRef, useState } from "react";

export function useLoadingPromise() {
	const promiseRef = useRef<Promise<any> | null>(null);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<Error|undefined>();

	const set = (promise: Promise<any>) => {
		promiseRef.current = promise;
		promise.then(
			(result: any) => {
				setError(undefined);
				return Promise.resolve(result);
			},
			(error) => {
				setError(error);
				return Promise.reject(error);
			}
		).finally(
			() => setPending(false)
		);
		setPending(true);
	}

	return {
		loading: (pending === true),
		error: (error || null),
		watch: set
	};
}
