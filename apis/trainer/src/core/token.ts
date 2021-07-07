import jwt from 'jsonwebtoken';
import { APIGatewayEvent } from "aws-lambda";
import { format } from "util";
const BEARER = 'Bearer ';

interface TokenPayload {
	email: string,
	roles: string[],
	secret: string,
}

/**
 * Thrown when something is wrong with the token, used to map to a 401
 */
export class InvalidTokenError extends Error {
	public code: string|undefined;

	constructor(code: string|undefined, message: string, ...args: unknown[]) {
		super(format(message, args));
		this.name = 'InvalidTokenError';
		this.code = code;
	}
}

/**
 * Create a new user token from teh provided paramaters
 * 
 * @param payload The payload for the token
 * @returns The string representation of the token
 */
export function createToken(payload: TokenPayload) {
	const { TOKEN_ISSUER, TOKEN_SECRET, TOKEN_ALGORITHM , TOKEN_EXPIRE } = process.env;

	return jwt.sign(payload, TOKEN_SECRET!, {
		expiresIn: TOKEN_EXPIRE,
		algorithm: TOKEN_ALGORITHM as any,
		issuer: TOKEN_ISSUER
	});
}

/**
 * Decode and verify a token returning its payload
 * 
 * @param token The token we want to verify and retrieve the payload for.
 * @returns The token payload 
 */
export function verifyToken(token: string) : TokenPayload {	
	const { TOKEN_ISSUER, TOKEN_SECRET, TOKEN_ALGORITHM } = process.env;

	try {
		return jwt.verify(token, TOKEN_SECRET!, { algorithms: [TOKEN_ALGORITHM as any], issuer: TOKEN_ISSUER }) as TokenPayload;
	} catch (error: any) {
		if (error.name === 'TokenExpiredError') {
			throw new InvalidTokenError('expired', 'The token has expired');
		} else if (error === 'JsonWebTokenError') {
			throw new InvalidTokenError('invalid_token', 'Invalid token contents');
		} else {
			throw new InvalidTokenError('unknown_token_error', error.message);
		}
	}
}

/**
 * Parses the 'authorization' header to look for user authentication.
 * 
 * @param event The lambda event which executed the function
 * @returns Token string, or null if there isn't one, throws an InvalidToken error 
 *   if the token was invalid (turned into a 401)
 */
export function getToken(event: APIGatewayEvent) {
	let header: string = '';
	for (const [name, value] of Object.entries(event.headers)) {
		if (!value) {
			continue;
		}

		if (name.toLowerCase() === 'authorization') {
			header = value.trim();
			break;
		}
	}

	// No header is fine.
	if (!header) {
		return null;
	}

	// Invalid header
	if (!header.startsWith(BEARER)) {
		throw new InvalidTokenError('invalid_authorization_header', 'Authorization header was not in the correct format');
	}

	return header.substring(BEARER.length);
}
