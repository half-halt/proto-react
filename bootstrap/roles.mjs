import { createOrUpdateFunction, allowReadIndex } from "./core/index.mjs";
import fauna from 'faunadb';
const { Let, Any, Var, Exists, If, IsArray, Map, Role, Query, Lambda, Collection,
		Match, Index, All, Create, Call, Function, Select, Paginate, Get, Roles } = fauna.query;

function HasRole(objectRef, name) {
	return Let({
			match: Match(Index('Role_Check'), objectRef, Role(name)),
		}, 
		If(
			Exists(Var('match')),
			true,
			false
		)
	)
}

function GetRoles(objectRef) {
	return Let({
			match: Match(Index('Object_Roles'), objectRef),
		},
		Select(
			['data'],
			Map(
				Paginate(Var('match')),
				Lambda(['object', 'role', 'ref'],
					Select(['name'], Get(Var('role')))
				)
			),
			[]
		)
	)
}

export default  {
	name: 'Roles',
	items: [
		{
			type: 'role',
			name: 'unauthenticated',
			privileges: [
				{
					resource: Collection('Role_Map'),
					actions: { read: true }
				},
				{
					resource: Function('GetRoles'),
					actions: { call: true },
				},
				{
					resource: Roles(),
					actions: { read: true }
				},
				allowReadIndex('Role_Check'),
				allowReadIndex('Object_Roles'),
			],
		},

		{
			type: 'role',
			name: 'Roles_Admin',
			membership:{
				predicate: Query(
					Lambda(['userRef'],
						Any([
							HasRole(Var('userRef'), 'Role_Admin'),
							HasRole(Var('userRef'), 'administrator')
						])
					)
				)
			},
			privileges: [
				{
					resource: Collection('Role_Map'),
					actions: { create: true, delete: true, update: true, read: true }
				},
				{
					resource: Function('AddRole'),
					actions: { call: true },
				},
				{
					resource: Function('HasRole'),
					actions: { call: true },
				},
				{
					resource: Function('HasRoles'),
					actions: { call: true },
				},
				{
					resource: Function('GetRoles'),
					actions: { call: true },
				},
				allowReadIndex('Role_Check'),
				allowReadIndex('Object_Roles'),
			]
		},


		{
			type: 'collection',
			name: 'Role_Map',
		},

		{
			type: 'index',
			name: 'Role_Check',
			source: Collection('Role_Map'),
			terms: [
				{ field: ['data', 'object' ]},
				{ field: ['data', 'role'] },
			],
			values: [
				{ field: ['data', 'object' ]},
				{ field: ['data', 'role' ]},
				{ field: 'ref' },
			]
		},

		{
			type: 'index',
			name: 'Object_Roles',
			source: Collection('Role_Map'),
			terms: [
				{ field: ['data', 'object' ]},
			],
			values: [
				{ field: ['data', 'object' ]},
				{ field: ['data', 'role'] },
				{ field: ['ref'] }
			],
		},

		{
			type: 'function',
			name: 'HasRole',
			role: Role("unauthenticated"),
			body: Query(
				Lambda(['objectRef', 'roles'], 
					If(
						IsArray(Var('roles')),
						Any(
							Map(Var('roles'),
								Lambda(['role'], HasRole(Var('objectRef'), Var('role')))
							)
						),
						HasRole(Var('objectRef'), Var('roles'))
					)
				)
			)
		},

		{
			type: 'function',
			name: 'HasRoles',
			role: Role("unauthenticated"),
			body: Query(
				Lambda(['objectRef', 'roles'], 
					If(
						IsArray(Var('roles')),
						All(
							Map(Var('roles'),
								Lambda(['role'], HasRole(Var('objectRef'), Var('role')))
							)
						),
						HasRole(Var('objectRef'), Var('roles'))
					)
				)
			)
		},

		{
			type: 'function',
			name: 'GetRoles',
			role: Role('unauthenticated'),
			body: Query(
				Lambda(['userRef'], 
					GetRoles(Var('userRef'))
				)
			)
		},

		{
			type: 'function',
			name: 'AddRole',
			role: Role('Roles_Admin'),
			body: Query(
				Lambda(['objectRef', 'name'],
					If(
						HasRole(Var('objectRef'), Var('name')),
						true,
						Create(Collection('Role_Map'), { data: {
							object: Var('objectRef'),
							role: Role(Var('name'))
						}})
					)
				)
			)
		},
	],
};