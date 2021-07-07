import { lastValueFrom, of, throwError } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { Context } from "../context";
import { checkFor404 } from "./deleteHorse";
import { horsesQueries } from "./queries";
import { GetHorseArgs, Horse } from "./types";

function validateArgs() {
	return switchMap(
		(args: GetHorseArgs) => {
			if (!args.id) {
				return throwError(() => new Error('bad request: id was not provied'));
			}

			return of(args);
		}
	)
}

/**
 * Implements the horse resolver, which retrieve a specific horse by id.
 * 
 * @param args The arguments for the resolver
 */
export function horse(args: GetHorseArgs, { log, query }: Context) {
	return lastValueFrom(
		of(args).pipe(
			validateArgs(),
			switchMap(
				args => query<Horse | null>(horsesQueries.get(args.id))
			),
			checkFor404('Unable to locate horse with the specified id. [id="%s"]', args.id),
			tap(
				horse => log('query:horse', 'Query for horse [id="%s"] completed successfully.', horse.id)
			)
		)
	);
}