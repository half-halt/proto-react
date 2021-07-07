import { lastValueFrom, of, throwError } from "rxjs";
import { Horse, UpdateHorseArgs } from "./types";
import { Context } from "../context";
import { switchMap, tap } from "rxjs/operators";
import { horsesQueries } from "./queries";

/**
 * Validates the state of the update arguments, GraphQL will validate the 
 * structure, but there is some additional validation we need to apply on top of it.
 */
function validateUpdate() {
	return switchMap(
		(args: UpdateHorseArgs) => {
			if (Object.keys(args.updates).length === 0) {
				return throwError(() => new Error('Bad request, no updates were provied'));
			}

			if (!args.id) {
				return throwError(() => new Error('The identifier of the horse to update must be provided'));
			}

			return of(args);
		}
	);
}

/**
 * Applies the update to the database, and swaps to the updated horse in the pipe.
 * 
 * @param query The query function we are going use to run our query
 */
function applyUpdates(query: Context["query"]) {
	return switchMap(
		(args: UpdateHorseArgs) => {
			return query<Horse | null>(horsesQueries.update(args.id, args.updates))
		}
	);
}

/**
 * Implements the updateHorse resolver which handles applying updates to the specified 
 * horse, there must be at least one update / change provied.
 * 
 * @param args The arguments for the resolver
 */
export function updateHorse(args: UpdateHorseArgs, { email, query, log }: Context) {
	log('mutation:updateHorse', 'Attempting to update horse [id="%s"]', args.id);
	
	return lastValueFrom(
		of(args).pipe(
			validateUpdate(),
			applyUpdates(query),
			switchMap(
				(result) => (result === null) ?
					throwError(() => new Error('404')) :
					of(result)
			),
			tap(
				horse => log('mutation:updateHorse', 'Successfully update horse [id="%s", user="%s"]', horse.id, email)
			)
		)
	);
}