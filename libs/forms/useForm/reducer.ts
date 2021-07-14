import { State } from "./state";
import { Actions, RegisterAction, setValueAction, validateFieldAction } from "./actions";
import { BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent, merge, Subscription } from "rxjs";
import { getFieldErrors } from "./validate";

export function markValid(element: HTMLElement, valid?: boolean) {
	if (valid === true) {
		element.classList.remove('invalid');
		element.classList.add('valid');
	} else if (valid === false) {
		element.classList.add('invalid');
		element.classList.remove('valid');
	} else {
		element.classList.remove('valid');
		element.classList.remove('invalid');
	}
}

export function getValues(state: State) {
	const values: Record<string, string> = {}
	for (const [name, control] of Object.entries(state.controls)) {
		values[name] = control.element.value;
	}
	return values;
}

function register(state: State, action: RegisterAction): State {
	const { dispatch, element, schema } = action;
	const subject = new BehaviorSubject<string | File>(state.defaultValues[element.name] || '');
	const subscriptions: Subscription[] = [];

	// Setup the default element state
	markValid(element);
	element.value = subject.getValue() as string;

	subscriptions.push(merge(
			fromEvent(element, "change"),
			fromEvent(element, "input"),
			fromEvent(element, "blur")
		).subscribe(event => {
			if ((event.type === 'blur') && schema) {
				dispatch(validateFieldAction(element.name, schema));
			} else if ((event.type === 'change') || (event.type === 'input')) {
				if (element.type !== 'file') {
					subject.next((event.target as HTMLInputElement).value);
				} else {
					const file = (event.target as HTMLInputElement)?.files?.item(0);
					if (file) {
						subject.next(file);
					}
				}
			}
		}));

	subscriptions.push(subject.asObservable().pipe(
			debounceTime(250), // Wait 250ms between updates
			distinctUntilChanged() // Wait for the value to actual change (no duplicates)
		).subscribe(
			(value) => dispatch(setValueAction(element.name, value as string))
		));

	const next = Object.assign({}, state);
	next.controls[element.name] = {
		element,
		subject,
		subscriptions
	};

	return next;
}


export function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case 'register':
			return register(state, action);

		case 'set': {
			const { field, value } = action;
			const next = Object.assign({}, state);
			next.values[field] = typeof(value) === 'string' ? value.trim() : value;
			return next;
		}

		case 'validate': {
			const { schema, field } = action;
			const control = state.controls[field];
			const value = control.element.value.trim();
			const errors = getFieldErrors(schema, field, value);
			
			const next = Object.assign({}, state);
			next.values[field] = value;
			if (errors === null) {
				delete next.errors[field];
			} else {
				next.errors[field] = errors;
			}

			return next;
		}

		case 'set-result': {
			return Object.assign({}, state, {
				errors: action.errors,
				values: action.values
			});
		}

		case 'cleanup': {
			for (const control of Object.values(state.controls)) {
				control.subscriptions.forEach(sub => sub.unsubscribe())
			}
			
			return Object.assign({}, state, { controls: {} });
		}
	}

	return state;
}