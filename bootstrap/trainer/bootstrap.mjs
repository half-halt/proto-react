import { createOrUpdateFunction, allowReadIndex } from "../core/index.mjs";
import fauna from 'faunadb';
const { Role, Query, Lambda, Collection, Call, Var } = fauna.query;

function CreateQueryAlbumsUdf() {
	return createOrUpdateFunction({
		name: 'getAlbums',
		role: Role('guest'),

	})
}


export default  {
	name: 'Albums',
	depends: ['roles'],
	items: [
	
	// Collections

	{
		type: 'collection',
		name: 'Albums'
	},

	// Functions 

	{
		type: 'function',
		name: 'GetAlbums',
		role: Role('guest'),
		body: Query(
			Lambda([], true)
		)
	},

	// Indexices

	{
		type: 'index',
		name: 'Albums_All',
		source: Collection('Albums'),
		values: [
			{ field: ['data', 'created'], reverse: true },
			{ field: ['ref'] }
		],
		serialized: true,
	},

	{
		type: 'index',
		name: 'Albums_By_Ref',
		source: Collection('Albums'),
		terms: [
			{ field: 'ref' },
		],
		values: [
			{ field: 'ref' },
			{ field: ['data', 'id'] },
		],
		serialized: true,
	},

	{
		type: 'index',
		name: 'Albums_By_Id',
		source: Collection('Albums'),
		terms: [
			{ field: ['data', 'id' ] },			
		],
		values: [
			{ field: 'ref' },
		],
	},

	{
		type: 'role',
		name: 'Albums_Admin',
		privileges: [
			{
				resource: Collection('Albums'),
				actions: {
					create: true,
					delete: true,
					update: true,
					read: true,
				}
			},
			allowReadIndex('Albums_All'),
			allowReadIndex('Albums_By_Id'),
			allowReadIndex('Albums_By_Ref'),
		],
		membership: {
			predicate: Query(
				Lambda('ref', Call('HasRole', Var('ref'), ['Administrator', 'Albums_Admin']))
			)
		}
	},

	{
		type: 'role',
		name: 'Albums_Editor',
		privileges: [
			{
				resource: Collection('Albums'),
				actions: { update: true, read: true },
			},
			allowReadIndex('Albums_All'),
			allowReadIndex('Albums_By_Id'),
			allowReadIndex('Albums_By_Ref'),
		],
		membership: {
			predicate: Query(
				Lambda('ref', Call('HasRole', Var('ref'), ['Administrator', 'Albums_Admin', 'Albums_Editor']))
			)
		}
	},

	{
		type: 'role',
		name: "Albums_User",
		membership: {
			predicate: Query(
				Lambda('ref', Call('HasRole', Var('ref'), ['Albums:User']))
			)
		},
		privileges:[
			allowReadIndex('Albums_All'),
			allowReadIndex('Albums_By_Id'),

		]
	},

	{
		type: 'function',
		name: 'CreateAlbum',
		body: Query(
			Lambda([], true)
		),
		role: Role('Albums_Admin'),
	}
]}