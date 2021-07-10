import { BehaviorSubject, Subscription } from "rxjs";

interface Control {
	element: HTMLInputElement;
	subject: BehaviorSubject<string | File>;
	subscriptions: Subscription[];
}

export interface State {
	defaultValues: Record<string, string>;
	values: Record<string, string>;
	errors: Record<string, string[]>;
	controls: Record<string, Control>;
}
