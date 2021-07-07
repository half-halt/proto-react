import { ComponentType, FunctionalComponent, isValidElement, VNode } from "preact";
import { useState, useEffect } from "preact/hooks";
import { serviceManagerInstance } from "../instance";

export interface ServicesProps {
	fallback?: ComponentType<any> | Element | VNode<any>;
}

export const Services: FunctionalComponent<ServicesProps> = ({
	fallback,
	children,
}) => {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		console.log('---> useeffect')
		const subscription = serviceManagerInstance.startup().subscribe({
			next: () => {
				setReady(true);
			},
			error: (error) => {
				console.error("Unable to initialize services:", error);
				setReady(false);
			},
		});

		return () => {
			subscription.unsubscribe();
			serviceManagerInstance.shutdown();
		};
	}, []);

	if (!ready) {
		return isValidElement(fallback) ? fallback : null;
	}

	return <>{children}</>;
};
