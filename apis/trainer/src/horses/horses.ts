import { lastValueFrom, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { Horses } from './types';
import { Context } from '../context';
import { horsesQueries } from "./queries";

/**
 * 
 * @param args 
 * @param param1 
 * @returns 
 */
export function horses(args: unknown, { query, log, email }: Context) {
	log('query:horses', 'Executing query (user="%s")', email);
		
	return lastValueFrom(
		of(args).pipe(
			switchMap(
				() => query<Horses>(horsesQueries.all())
			),
			tap(
				horses => {
					log('query:horses', 'Complete (%d items)', horses.length);
				}
			)
		)
	);
}