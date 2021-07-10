import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export function useObservable<T>(subject: Observable<T>, initial?: T): T {
	const [value, setValue] = useState<T>(initial as T);

	useEffect(() => {
		const subscription = subject.subscribe(setValue);
		return () => subscription.unsubscribe();
	}, [subject]);	

	return value;
}