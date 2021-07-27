import { createOrUpdateFunction, allowReadIndex } from "./core/index.mjs";
import fauna from 'faunadb';
const { Let, Any, Var, Exists, If, IsArray, Map, Role, Query, Lambda, Collection, Format, TimeAdd, IsEmpty,
		Match, Index, All, Create, Call, Function, Select, Paginate, Get, Roles, Not, Login, Now, Intersection,
		IsNull, Equals, Filter, EndsWith, Or, Foreach, Delete, And, Do, NewId, Abort } = fauna.query;

function HasRole(objectRef, name) {
	return Let({
			match: Match(Index('Role_Check'), objectRef, Role(name)),
		}, 
		If(
			Exists(Var('match')),
			true,
			EndsWith(name, "_User")
		)
	)
}

export function CheckRole(userRef, roleOrRoles) {
	return Let({
			userRoles: Select(['data', 'roles'], Get(userRef), []),
			check: If(
				IsArray(roleOrRoles),
				roleOrRoles,
				[roleOrRoles]
			)
		},
		Not(
			IsEmpty(
				Intersection(Var('check'), Var('userRoles'))
			)
		)
	)
}

function CheckRoleAccess(objectRef, roleRef) {
	return Let({
			role: Get(roleRef),
			name: Select('name', Var('role')),
			resource: Select(['membership', 'resource'], Var('role'), null),
			predicate: Select(['membership', 'predicate'], Var('role'), null),
			match: Match(Index('Role_Check'), objectRef, roleRef),
			objectCollection: Select('collection', objectRef),
		},
		If(
			Not(
				IsNull(Var('resource'))
			),
			Equals(
				Var('resource'),
				Var('objectCollection')
			),
			If(
				Not(
					IsNull(Var('predicate'))
				),
				Or(
					Exists(Var('match')),
					EndsWith(Var('name'), "_User"),
				),
				false
			)
		)
	);
}

function GetRoles(objectRef) {
	return Filter(
		Select(
			['data'],
			Map(
				Paginate(Roles()),
				Lambda(['roleRef'],
					If(
						CheckRoleAccess(objectRef, Var('roleRef')),
						Select('name', Get(Var('roleRef'))),
						null
					)
				)
			),
			[]
		),
		Lambda('item',
			Not(IsNull(Var('item')))
		)
	)
}

function CreateUser(name, email, password, roles) {
	return Let({
			user: Create(Collection('Users'), { 
				credentials: {
					password
				},
				data: {
					id: NewId(),
					name,
					email
				}
			}),
			userRef: Select('ref', Var('user'))
		},
		Do(
			Foreach(
				(roles || []), 
				Lambda(['role'],
					Create(
						Collection('Role_Map'), { data: {
							object: Var('userRef'),
							role: Role(Var('role'))
						}}
					)
				)
			),
			{
				id:Select(['data', 'id'], Var('user')),
				name: Select(['data', 'name'], Var('user')),
				email: Select(['data', 'name'], Var('user')),
				roles: GetRoles(Var('userRef')),
			}
		)
	)
}

export default  {
	name: 'Roles',
	items: [
		{
			type: 'collection',
			name: 'Role_Map',
		},

		{
			type: 'collection',
			name: 'Users',
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
			type: 'index',
			name: 'User_By_Id',
			source: Collection('Users'),
			terms: [
				{ field: ['data', 'id' ]},
			],
			values: [
				{ field: ['ref'] }
			],
		},

		{
			type: 'index',
			name: 'User_By_Email',
			source: Collection('Users'),
			terms: [
				{ field: ['data', 'email' ]},
			],
			values: [
				{ field: ['ref'] },
				{ field: ['data', 'email' ]}
			],
			unique: true,
			serialized: true,
		},		

		{
			type: 'role',
			name: 'unauthenticated',
			privileges: [
				{
					resource: Collection('Role_Map'),
					actions: { read: true }
				},
				{
					resource: Collection('Users'),
					actions: { read: true }
				},
				{
					resource: Function('GetRoles'),
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
					resource: Function('UserLogin'),
					actions: { call: true },
				},
				{
					resource: Roles(),
					actions: { read: true }
				},
				allowReadIndex('Role_Check'),
				allowReadIndex('Object_Roles'),
				allowReadIndex('User_By_Email'),
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
							HasRole(Var('userRef'), 'Administrator')
						])
					)
				)
			},
			privileges: [
				{
					resource: Collection('Role_Map'),
					actions: { create: true, delete: true, write: true, read: true }
				},
				{
					resource: Index('Role_Check'),
					actions: { read: true, write: true, delete: true, create: true }
				},				
				{
					resource: Index('Object_Roles'),
					actions: { read: true, write: true, delete: true, create: true }
				},				
				{
					resource: Function('GrantRole'),
					actions: { call: true },
				},
				{
					resource: Function('DenyRole'),
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
				{
					resource: Roles(),
					actions: { read: true }
				},
			]
		},

		{
			type: 'role',
			name: 'User',
			membership: {
				resource: Collection('Users')
			},
			privileges: [
				{
					resource: Collection('Users'),
					actions: { read: true }
				},
			]
		},

		{
			type: 'role',
			name: 'Administrator',
			membership: {
				predicate: Query(
					Lambda('ref', HasRole(Var('ref'), 'Administrator'))
				)
			},
			privileges: [

			]
		},

		{
			type: 'function',
			name: 'HasRole',
			role: 'admin',
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
			role: "admin",
			body: Query(
				Lambda(['userRef'], 
					GetRoles(Var('userRef'))
				)
			)
		},

		{
			type: 'function',
			name: 'GrantRole',
			role: Role('Roles_Admin'),
			body: Query(
				Lambda(['objectRef', 'name'],
					If(
						And(
							EndsWith(Var('name'), '_User'),
							HasRole(Var('objectRef'), Var('name')),
						),
						Call('GetRoles', Var('objectRef')),
						Do(
							Create(Collection('Role_Map'), { data: {
								object: Var('objectRef'),
								role: Role(Var('name'))
							}}),
							Call('GetRoles', Var('objectRef'))
						)
					)
				)
			)
		},

		{
			type: 'function',
			name: 'DenyRole',
			role: Role('Roles_Admin'),
			body: Query(
				Lambda(['objectRef', 'name'],
					If(
						And(
							Not(EndsWith(Var('name'), '_User')),
							HasRole(Var('objectRef'), Var('name'))
						),
						Do(
							Foreach(
								Paginate(
									Match(
										Index('Role_Check'),
										Var('objectRef'), 
										Role(Var('name'))
									)
								),
								Lambda(['objectRef', 'roleRef', 'ref'],
									Delete(Var('ref'))
								)
							),
							Call('GetRoles', Var('objectRef'))
						),
						Call('GetRoles', Var('objectRef'))
					)
				)
			)
		},

		{
			type: 'function',
			name: 'RegisterUser',
			role: 'admin',
			body: Query(
				Lambda(['name', 'email', 'password', 'roles'],
					CreateUser(Var('name'), Var('email'), Var('password'), Var('roles'))
				)
			)
		},

		{ 
			type: 'function',
			name: 'DeleteUser',
			role: 'admin',
			body: Query(
				Lambda(['id'],
					Let({
							match: Match(Index('User_By_Id'), Var('id')),
							userRef: If(
								Exists(Var('match')),
								Select(['data', 0], Paginate(Var('match'))),
								Abort(Format('Unable to locate user with "%s"', Var('id')))
							)
						},
						Do(
							Foreach(
								Paginate(Match(Index('Object_Roles'), Var('userRef'))),
								Lambda(['object', 'role', 'ref'], 
									Delete(Var('ref'))
								)
							),
							Select(['data'], Delete(Var('userRef')))
						)
					)
				)
			)
		},

		{
			type: 'function',
			name: 'UserLogin',
			role: Role('unauthenticated'),
			body: Query(
				Lambda(['email', 'password'], 
					Let({
							match: Match(Index('User_By_Email'), Var('email')),
							userRef: If(
								Exists(Var('match')),
								Select(['data', 0, 0], Paginate(Var('match'))),
								null
							),
						},
						If(
							IsNull(Var('userRef')),
							Abort(Format('Unable to locate an account "%s"', Var('email'))),
							Let({
									login: Login(Var('userRef'), {
										password: Var('password'),
										ttl: TimeAdd(Now(), 2, "days")
									}),
									user: Get(Select('instance', Var('login'))),
									roles: Call('GetRoles', Select('ref', Var('user')))
								},
								{
									token: Select('secret', Var('login')),
									id: Select(['data', 'id'], Var('user')),
									name: Select(['data', 'name'], Var('user')),
									email: Select(['data', 'email'], Var('user')),
									roles: Var('roles'),
								}
							)
						)
					)
				)
			)
		}
	],
};