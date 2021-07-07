import { Create, query } from 'faunadb';
import { nanoid } from "nanoid";
import { CreateHorseInput, Horse, UpdateHorseInput } from './types';
const { Select, Match, Paginate, Index, Map, Lambda, Get, Var, If, Exists,
		Let, Collection, Update, Abort, Format, Delete, Not, IsNull } = query;

function ref(id: string) {
	return Let({
			match: Match(Index('horseById'), id),
			ref: If(
				Exists(Var('match')),
				Select(['data', 0, 0], Paginate(Var('match'))),
				Abort(Format('There is no horse with the specified id "%s"', id))
			)
		},
		Var('ref')
	);
}

// Retruns an array of Horse items
function all() {
	return Select("data", 
		Map(
			Paginate(Match(Index('allHorses'))),
			Lambda(['ref'],
				Select(['data'], Get(Var('ref')))
			)
		)
	);
}

function get(id: string) {
	return Let({
			match: Match(Index('horseById'), id),
			ref: If(
				Exists(Var('match')),
				Select(['data', 0, 0], Paginate(Var('match'))),
				null
			)
		},
		If(
			Not(IsNull(Var('ref'))),
			Select(['data'], Get(Var('ref'))),
			null
		)
	);
}

function create(horse: CreateHorseInput) {
	const data: Horse = {
		...horse,
		id: nanoid(16)
	};
	
	return Let({	
			created: Create(Collection('horses'), {
				data
			})
		},
		Select(['data'], Var('created'))
	);
}

function update(id: string, updates: UpdateHorseInput) {
	return Let({
			match: Match(Index('horseById'), id),
			ref: If(
				Exists(Var('match')),
				Select(['data', 0, 0], Paginate(Var('match'))),
				null
			)
		},
		If(
			Not(IsNull(Var('ref'))),
			Select(['data'], Update(Var('ref'), { data: updates })),
			null
		)
	);
}

function deleteHorse(id: string) {
	return Let({
			match: Match(Index('horseById'), id),
			ref: If(
				Exists(Var('match')),
				Select(['data', 0, 0], Paginate(Var('match'))),
				null
			)
		},
		If(
			Not(IsNull(Var('ref'))),
			Select(['data'], Delete(Var('ref'))),
			null
		)
	);
}

export const horsesQueries =  Object.freeze({
	ref, all, get, create, update, delete: deleteHorse
});
