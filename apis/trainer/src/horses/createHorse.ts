import { Context } from "../context";
import { lastValueFrom } from "rxjs";
import { CreateHorseArgs, Horse } from "./types";
import { horsesQueries } from "./queries";
import { of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

export function createHorse(args: CreateHorseArgs, { log, query, email }: Context) {
	log('mutation:createHorse', 'create horse "%s" [user=%s]', args.data.name, email);

	return lastValueFrom(
		of(args).pipe(
			switchMap(
				(args) => query<Horse>(horsesQueries.create(args.data))
			),
			tap(
				horse => log('mutation:createHorse', 'Successfully created horse [id="%s", name="%s"]', horse.id, horse.name)
			)
		)
	);
}