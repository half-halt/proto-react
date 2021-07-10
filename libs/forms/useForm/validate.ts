import { State } from "./state";
import { AnySchema, ValidationError } from "yup";

export function getErrors(state: State, schema: AnySchema, value: unknown) {
	const errors: Record<string, string[]> = {};

	try {
		schema.validateSync(value, { abortEarly: false});
	} catch (error) {
		if (error instanceof ValidationError) {
			for (const err of error.inner) {
				if (err.path) {
					let current = errors[err.path];
					let errs = Array.isArray(err.errors) ? err.errors : [error.message];
					if (Array.isArray(current)) {
						current = current.concat(errs);
					} else {
						current = errs;
					}

					errors[err.path] = current;
				}
			}
		}
	}

	return errors;
}

export function getFieldErrors(schema: AnySchema, path: string, value: unknown) {
	try {
		const target = {
			[path]: value
		};

		schema.validateSyncAt(path, target, { abortEarly: false });
	} catch (error) {
		if (error instanceof ValidationError) {
			return Array.isArray(error.errors) ? error.errors : [error.message];
		}
	}	

	return null;
}
