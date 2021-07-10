import { RefCallback } from "react";
import {  useEffect, useReducer } from "react";
import { BehaviorSubject, fromEvent, Subscription, merge } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { AnySchema, ValidationError } from "yup";
import { cleanupAction, registerAction, setResultsAction } from "./actions";
import { getValues, reducer } from "./reducer";
import { State } from "./state";
import { getErrors } from "./validate";

interface Options<T> {
	schema?: AnySchema;
	defaultValues?: T;
}

interface UseForm<T> {
	valid: boolean,
	errors: Record<string, string[]>;
	value: T;
	register: RefCallback<HTMLInputElement>;
	validate(): { 
		value: T;
		errors: Record<string, string[]>;
		valid: boolean;
	}
}

/**
 * @param defaultValues 
 * @returns 
 */
function createState<T>(defaultValues: T|undefined): State {
	return {
		controls: {},
		values: {},
		errors: {},
		defaultValues: Object.assign({}, defaultValues || {})
	}
}

/**
 * 
 * @param options 
 * @returns 
 */
export function useForm<T>(options: Options<T>): UseForm<T> {
	const [state, dispatch] = useReducer(reducer, options.defaultValues, createState);

	// Register an effect to cleanup our controls.
	useEffect(() => {
		return () => {
			dispatch(cleanupAction())
		}
	}, [])

	// Callback to handle registering a new control
	const register: RefCallback<HTMLInputElement> = (element) => {
		if (!element || state.controls[element.name]) {
			return;
		}
		
		dispatch(registerAction(element, dispatch, options.schema));
	}

	// Callback to handle validating all the registered field
	const validate = () => {
		const values = getValues(state);
		if (options.schema) {
			const errors = getErrors(state, options.schema, values);

			setTimeout(dispatch, 0, setResultsAction(values, errors));
			return { valid: (Object.keys(errors).length === 0), errors, value: (values as unknown) as T };
		}

		return { valid: true, errors: {}, value: (values as unknown) as T };
	}
	
	return {
		register,
		validate,
		value: (state.values as unknown) as T,
		errors: state.errors,
		valid: (Object.keys(state.errors).length !== 0)
	}
}