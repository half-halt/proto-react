import { APIGatewayEvent } from "aws-lambda";
import { format, inspect } from "util";
import * as chalk from 'chalk';
import { getToken, verifyToken } from "./core/token";
import { Client, ExprArg, QueryOptions } from 'faunadb';
import { Observable } from "rxjs";

export interface Context {
	email: string;
	roles: string[],
	authenticated: boolean;
	query<T = any>(expr: ExprArg, options?: QueryOptions): Observable<T>;
	log(component: string | undefined | null, text: string, ...args: unknown[]): void;
}

export function createContext(event: APIGatewayEvent) {
	// Determine the request id
	let requestId = event.headers['x-hhf-request'];
	if (!requestId) {
		requestId = chalk.yellow('<none>');
	}

	let email = '<guest>';
	let roles = ['guest'];
	let authenticated = false;
	let secret = process.env.FAUNA_ADMIN_SECRET!;
	

	// See if we are authenticated, if we are then verify and extract the details
	// from the token.
	const token = getToken(event);
	if (token) {
		const userInfo = verifyToken(token);
		if (userInfo) {
			email = userInfo.email;
			roles = userInfo.roles;
			authenticated = true;
			secret = userInfo.secret;
		}
	}

	// attach the users client or the guest client
	const faunaClient = new Client({secret});
	function query<T>(expr: ExprArg, options?: QueryOptions) {
		return new Observable<T>(
			subject => {
				faunaClient.query<T>(expr, options).then(
					(result) => {
						subject.next(result);
						subject.complete();
					},
					(error) => {
						console.log(inspect(error, true, 4, true));
						subject.error(error);
						subject.complete();
					}
				)
			});
	}

	function log(component: string | undefined | null, text: string, ...args: unknown[]) {
		console.log('%s%s :: %s', 
			chalk.greenBright(requestId),
			component ? chalk.cyanBright('['.concat(component, ']')) : '',
			format(
				text, ...args
			));
	}

	return Object.freeze({
		email,
		roles,
		authenticated,
		query,
		log
	} as Context);
}