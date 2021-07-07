import { useRef } from "preact/hooks";
import { serviceManagerInstance, ServiceType } from "./instance";

/**
 * Retrieve an instance of the specified service 
 */
export function useService<T, I = T>(service: ServiceType<T>) {
	const ref = useRef<I>();

	if (!ref.current) {
		ref.current = serviceManagerInstance.get<T, I>(service);
	}
	
	return ref.current;
}