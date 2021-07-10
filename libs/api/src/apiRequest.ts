import { from, Observable, switchMap, throwError } from "rxjs";
import { HeaderService } from "sites/trainer/src/components/header/Header";
import { string } from "yup/lib/locale";

interface Options {
	token: string;
}

export function apiRequest<T = any>(url: string, query: string, variables?: any, options?: Options) {
	return new Observable<T>(subject => {
		const headers = new Headers({
			'x-hhf-request': Date.now().toString(),
			'content-type': 'application/json'
		});

		console.log(options);
		if (options && options.token) {
			headers.append('authorization', `Bearer ${options.token}`);
		}

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
