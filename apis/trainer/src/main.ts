import { APIGatewayEvent, APIGatewayProxyCallback, APIGatewayProxyResult, Context as APIContext } from "aws-lambda";
import { graphql } from "graphql";
import { schema } from './schema';
import { createContext } from './context';
import horseResolves from "./horses/";
import { InvalidTokenError } from "./core/token";
import { inspect } from "util";
const { PRODUCTION } = process.env;

function errorToResponse(error: Error): APIGatewayProxyResult {
	if (error instanceof InvalidTokenError) {
		const body: Record<string, string> = {
			code: (error.code || 'invalid_token').toUpperCase(),
			message: error.message,
		};

		if (!PRODUCTION) {
			body.fullError = inspect(error, false, 3, false)
		}

		return {
			statusCode: 401,
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		};

	} else {
		const body: Record<string, string> = {
			code: 'NONE',
			message: error.message,
		}

		if (!PRODUCTION) {
			body.fullError = inspect(error, false, 3, false)
		}

		return {
			statusCode: 500, 
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		}
	}
}

export function handler(event: APIGatewayEvent, context: APIContext, callback: APIGatewayProxyCallback) {

	if (event.httpMethod === 'OPTIONS') {
		callback(undefined, {
			statusCode: 200,
			headers: {
				'access-control-allow-origin': '*',
				'access-control-allow-methods': 'POST',
				'access-control-allow-headers': '*',
			},
			body: '',
		})
		return;
	}

	const json = JSON.parse(event.body || '');
	console.log(json);

	try {
		graphql(
			schema, 
			json.query,
			Object.assign({}, horseResolves),
			createContext(event),
			json.variables || {}
		).then(
			(result) => {
				console.log(result);
				if (Array.isArray(result.errors)) {
					callback(undefined, errorToResponse(result.errors[0]));
				} else {
					callback(undefined, { statusCode: 200, body: JSON.stringify(result.data || {}), headers: { 
						'content-type': 'application/json',
						'access-control-allow-origin': '*',
						'access-control-allow-methods': 'POST',
						'access-control-allow-headers': '*',
					}});
				}
			},
			(error) => {
				// todo: we should likely have error - to - response here
				callback(error);
			}
		);
	} catch (error: any) {
		callback(undefined, errorToResponse(error))
	}
}
