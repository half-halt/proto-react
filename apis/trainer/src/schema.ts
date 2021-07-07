import { buildSchema } from "graphql";

export const schema = buildSchema(`#graphql
	type Horse {
		id: ID!
		name: String!
		nickname: String
	}

	type Query {
		horses: [Horse]!
		horse(id: ID!): Horse!
	}

	input UpdateHorseInput {
		name: String
		nickname: String
	}

	input CreateHorseInput {
		name: String!
		nickname: String
	}


	type Mutation {
		createHorse(data: CreateHorseInput!): Horse!
		deleteHorse(id: ID!): Horse!
		updateHorse(id: ID!, updates: UpdateHorseInput!): Horse!
	}
`);