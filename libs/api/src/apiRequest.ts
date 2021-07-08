import { from, Observable, switchMap, throwError } from "rxjs";

export function apiRequest<T = any>(url: string, query: string, variables?: any) {
	return new Observable<T>(subject => {
		const headers = new Headers({
			'x-hhf-request': Date.now().toString(),
			'content-type': 'application/json'
		});

		console.log("url:", url);
		from(fetch(url, {
			method: 'POST',
			headers,
			redirect: 'error',
			body: JSON.stringify({
				query,
				variables: variables || {}
			})
		})).pipe(
			switchMap(
				(response) => { 
					console.dir(response);
					return response.ok ? 
					from(response.json()) :
					throwError(() => new Error(`Request Failed ${response.status}`))
				}
			)
		).subscribe({
			next(data) {
				subject.next(data as T);
				subject.complete();
			},
			error(error) {
				subject.error(error);
				subject.complete()
			}
		})
	});
}
