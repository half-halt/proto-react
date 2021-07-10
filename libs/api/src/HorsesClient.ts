import { firstValueFrom, of } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { apiRequest } from "./apiRequest";
import { Horse, Horses, HorseUpdates } from "@hhf/trainer-api-types";
import { LogService } from "@hhf/services";
import { rejects } from "assert";

const HORSES_SHAPES = `#graphql
	fragment HorseShape on Horse {
		id
		name
		nickname
	}`;

const HORSES_QUERY = `#graphql
	${HORSES_SHAPES} 
	query { 
		horses { 
			...HorseShape 
		} 
	}`;

const HORSE_QUERY = `#graphql
	${HORSES_SHAPES} 
	query ($id: ID!) { 
		horse(id: $id) { 
			...HorseShape
		}
	}`;

const CREATE_QUERY = `#graphql
	${HORSES_SHAPES}
	mutation ($data: HorseUpdates!) {
		createHorse(data: $data) {
			...HorseShape
		}
	}`;

const UPDATE_QUERY  = `#graphql
	${HORSES_SHAPES}
	mutation ($id: ID!, $updates: HorseUpdates!) {
		updateHorse(id: $id, updates: $updates) {
			...HorseShape
		}
	}`;

const DELETE_QUERY  = `#graphql
	${HORSES_SHAPES}
	mutation ($id: ID!) {
		deleteHorse(id: $id) {
			...HorseShape
		}
	}`;	

// todo: add caching
export class HorsesClient {
	static Dependencies = [LogService];
	private _cache = new Map<string, Horse>();
	private _all = false;

	constructor(
		private logger: LogService
	) {}

	getHorses = () => {
		if (this._all) {
			return of(Array.from(this._cache.values()))
		}

		this.logger.log('HorsesClient: sending request for all horses');
		return apiRequest<{ horses: Horses }>(process.env.TRAINER_API_URL!!, HORSES_QUERY).pipe(
			switchMap(response => of(response.horses)),
			tap(
				horses => {
					this._cache.clear();
					this._all = true;
					horses.forEach(horse => this._cache.set(horse.id, horse));
				}
			)
		);
	}

	horses(token?: string) {
		this.logger.log('HorsesClient: sending request for all horses');
		return firstValueFrom<Horses>(
			apiRequest<{ horses: Horses }>(process.env.TRAINER_API_URL!!, HORSES_QUERY, {}, { token: token ? token : '' }).pipe(
				switchMap(response => of(response.horses))
			));
	}

	getHorse = (id: string) => {
		const cache = this._cache.get(id);
		if (cache) {
			return of(cache);
		}

		this.logger.log('HorsesClient: sending request for horse {0}', id);
		return apiRequest<{ horse: Horse }>(process.env.TRAINER_API_URL!!, HORSE_QUERY, { id }).pipe(
			switchMap(response => of(response.horse)),
			tap(
				horse => this._cache.set(horse.id, horse)
			)
		);
	}

	createHorse = (data: HorseUpdates) => {
		this.logger.log('HorsesClient: creating new horse {0}', data.name || '');
		return apiRequest<{ createHorse: Horse }>(process.env.TRAINER_API_URL!!, CREATE_QUERY, { data }).pipe(
			switchMap(response => of(response.createHorse)),
			tap(horse => this._cache.set(horse.id, horse))
		)
	}

	updateHorse = (id: string, updates: HorseUpdates) => {
		this.logger.log('HorsesClient: updating horse {0}', id);
		return apiRequest<{ updateHorse: Horse }>(process.env.TRAINER_API_URL!!, UPDATE_QUERY, { id, updates }).pipe(
			switchMap(response => of(response.updateHorse)),
			tap(horse => this._cache.set(horse.id, horse))			
		)
	}

	deleteHorse = (id: string) => {
		this.logger.log('HorsesClient: deleting horse {0}', id);
		return apiRequest<{ deleteHorse: Horse }>(process.env.TRAINER_API_URL!!, DELETE_QUERY, { id }).pipe(
			switchMap(response => of(response.deleteHorse)),
			tap(horse => this._cache.delete(horse.id))
		)
	}	
}