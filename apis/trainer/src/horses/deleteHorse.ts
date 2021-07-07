import { lastValueFrom, of, throwError } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { format } from "util";
import { Context } from "../context";
import { horsesQueries } from "./queries";
import { DeleteHorseArgs, Horse } from "./types";

export function checkFor404<T = unknown>(message: string, ...args: unknown[]) {
	return switchMap(
		(value: T | null) => {
			if (!value) {
				return throwError(() => new Error(`404: ${format(message, ...args)}`));
			}

			return of(value);
		}
	)
}

export function deleteHorse(args: DeleteHorseArgs, { log, email, query }: Context) {
	log('mutation:deleteHorse', 'Deleting horse id="%s" [user="%s"]', args.id, email);

	return lastValueFrom(
		of(args).pipe(
			switchMap(
				args => {
					if (!args.id) {
						return throwError(() => new Error('bad request no id'));
					}
					
					return of(args);
				}
			),
			switchMap(
				args => query<Horse | null>(horsesQueries.delete(args.id))
			),
			checkFor404('Unable to locate a horse with the id="%s"', args.id),
			tap(
				horse => log('mutation:deleteHorse', 'Successfully deleted horse [id="%s", user="%s"]', horse.id, email)
			)
		)
	);
}