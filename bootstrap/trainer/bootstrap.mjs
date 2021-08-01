import { createOrUpdateFunction, allowReadIndex } from "../core/index.mjs";
import fauna from 'faunadb';
import { CheckRole } from  "../roles.mjs";
const { Role, Query, Lambda, Collection, Call, Var, Select, Map, Get, Paginate, Update, Create, Merge, Any, Or, And,
		Exists, Match, Index, Let, NewId, If, Do, Function, Not, IsNull, Delete, Abort, Format, Equals } = fauna.query;


function CreateQueryAlbumsUdf() {
	return createOrUpdateFunction({
		name: 'getAlbums',
		role: Role('guest'),

	})
}

function CreateOrUpdateAlbum(album, add, remove) {
	return Let(
		{
			albumId: Select('id', album, NewId()),
			match: Match(Index('Albums_By_Id'), Var('albumId')),
			result: If(
				Exists(Var('match')),
				Update(Select(['data', 0], Paginate(Var('match'))), { data: Var('album') }),
				Create(Collection('Albums'), { data: Var('album') })
			)
		},
		Do(
			Select('data', Var('result'))
		)
	);
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

	{
		type: 'collection',
		name: 'Album_Contents'
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
		type: 'index',
		name: 'Album_Content_FromRef',
		source: Collection('Album_Contents'),
		terms: [
			{ field: ['data', 'album' ] },	
		],
		values: [
			{ field: ['data', 'album' ] },
			{ field: ['data', 'item' ] },
			{ field:  'ref' },
		],
	},

	// Roles

	{
		type: 'role',
		name: 'Albums_Admin',
		privileges: [
			{
				resource: Collection('Albums'),
				actions: {
					create: true,
					delete: true,
					write: true,
					read: true,
				}
			},
			{
				resource: Collection('Users'),
				actions: { read: true },
			},
			{
				resource: Function('CreateAlbum'),
				actions: { call: true },
			},			
			{
				resource: Function('UpdateAlbum'),
				actions: { call: true },
			},
			{
				resource: Function('DeleteAlbum'),
				actions: { call: true },
			},			
			{
				resource: Function('GetAlbums'),
				actions: { call: true },
			},			
			allowReadIndex('Albums_All'),
			allowReadIndex('Albums_By_Id'),
			allowReadIndex('Albums_By_Ref'),
			allowReadIndex('Album_Content_FromRef'),
		],
		membership: {
			predicate: Query(
				Lambda('ref',
					And(
						Equals(Collection('Users'), Select('collection', Var('ref'))),
						CheckRole(Var('ref'), ["Administrator", "Albums_Admin"])
					)
				)
			)
		},
	},

	{
		type: 'role',
		name: 'Albums_Editor',
		privileges: [
			{
				resource: Collection('Albums'),
				actions: { write: true, read: true },
			},
			{
				resource: Function('UpdateAlbum'),
				actions: { call: true },
			},
			{
				resource: Function('GetAlbums'),
				actions: { call: true },
			},
			allowReadIndex('Albums_All'),
			allowReadIndex('Albums_By_Id'),
			allowReadIndex('Albums_By_Ref'),
			allowReadIndex('Album_Content_FromRef'),
		],
		membership: {
			predicate: Query(
				Lambda('ref', 
					And(
						Equals(Collection('Users'), Select('collection', Var('ref'))),
						CheckRole(Var('ref'), ['Administrator', 'Albums_Admin', 'Albums_Editor'])
					)
				)
			)
		},
	},

	{
		type: 'role',
		name: "Albums_User",
		membership: {
			predicate: Query(
				Lambda('ref', 
					Or(
						Equals(Collection('Users'), Select('collection', Var('ref'))),
						CheckRole(Var('ref'), ["Administrator", "Albums_Admin"])
					)
				)
			)
		},
		privileges:[
			{
				resource: Collection('Albums'),
				actions: { read: true },
			},
			{
				resource: Collection('Users'),
				actions: { read: true },
			},
			{
				resource: Function('GetAlbums'),
				actions: { call: true },
			},
			allowReadIndex('Albums_All'),
			allowReadIndex('Albums_By_Id'),
			allowReadIndex('Album_Content_FromRef'),
		]
	},

	{
		type: 'function',
		name: 'GetAlbums',
		role: Role('Albums_User'),
		body: Query(
			Lambda([],
				Select("data",
					Map(
						Paginate(Match(Index('Albums_All'))),
						Lambda(['created', 'ref'],
							Let({
									match: Match(Index('Album_Content_FromRef'), Var('ref')),
									contents: If(
										Exists(Var('match')),
										Select('data', Paginate(Var('match'))),
										[]
									)
								},
								Merge(									
									Select('data', Get(Var('ref'))),
									{
										contents: Var('contents')
									}
								)
							)
						)
					),
					[]
				)
			)
		)
	},


	{
		type: 'function',
		name: 'CreateAlbum',
		role: Role('Albums_Admin'),
		body: Query(
			Lambda(['album', 'add'],
				CreateOrUpdateAlbum(Var('album'), Var('add'), [])
			)
		),
	},

	{
		type: 'function',
		name: 'UpdateAlbum',
		role: Role('Albums_Editor'),
		body: Query(
			Lambda(['album', 'add', 'remove'],
				CreateOrUpdateAlbum(Var('album'), Var('add'), Var('remove'))
			)
		),
	},	

	{
		type: 'function',
		name: 'DeleteAlbum',
		role: Role('Albums_Admin'),
		body: Query(
			Lambda(['albumId'],
				Let({
						match: Match(Index('Albums_By_Id'), Var('albumId')),
						albumRef: If(
							Exists(Var('match')),
							Select(['data', 0], Paginate(Var('match'))),
							null
						)						
					},
					Do(
						If(
							Not(IsNull(Var('albumRef'))),
							Select('data', Delete(Var('albumRef'))),
							Abort(Format('Unable to locate an album ["%s"]', Var('albumId')))
						)
					)
				)
			)
		),
	},		
]}