import { AnySchema } from 'yup';

interface Action {
	type: 'cleanup' |'register' | 'set' | 'validate' | 'set-result';
}

type DispatchFunction = (action: Actions) => void;

export interface RegisterAction extends Action {
	type: 'register';
	element: HTMLInputElement;
	schema?: AnySchema;
	dispatch: DispatchFunction;
}

export function registerAction(element: HTMLInputElement, dispatch: DispatchFunction, schema?: AnySchema): RegisterAction {
	return {
		type: 'register',
		element,
		dispatch,
		schema
	};
}

export interface SetResultAction extends Action {
	type: 'set-result';
	errors: Record<string, string[]>;
	values: Record<string, string>;
}

export function setResultsAction(values: Record<string, string>, errors: Record<string, string[]>): SetResultAction {
	return {
		type: 'set-result',
		errors,
		values
	}
}

export interface ValidateFieldAction extends Action {
	type: 'validate',
	field: string;
	schema: AnySchema;
}

export function validateFieldAction(field: string, schema: AnySchema): ValidateFieldAction {
	return {
		type: 'validate',
		field,
		schema
	};
}

export interface SetValueAction extends Action {
	type: 'set';
	field: string;
	value: string;
}

export function setValueAction(field: string, value: string): SetValueAction {
	return {
		type: 'set',
		field,
		value
	};
}

export interface CleanupAction extends Action {
	type: 'cleanup';
}

export function cleanupAction(): CleanupAction { 
	return { type: 'cleanup' }
}

export type Actions = CleanupAction | ValidateFieldAction | SetValueAction | SetResultAction | RegisterAction;
