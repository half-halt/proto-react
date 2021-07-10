import { ComponentType, FunctionComponent, isValidElement, ReactElement } from "react";
import { useState, useEffect } from "react";
import { serviceManagerInstance } from "../instance";

export interface ServicesProps {
	fallback?: ComponentType<any> | Element | ReactElement<any, any>;
}

export const Services: FunctionComponent<ServicesProps> = ({
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
