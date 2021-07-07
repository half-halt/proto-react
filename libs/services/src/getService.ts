import { serviceManagerInstance, ServiceType } from "./instance";

/**
 * Get the instance of the specified service.
 * 
 * @param service The service to retrieve
 * @returns The instance of the service
 */
export function getService<T>(service: ServiceType<T>) {
	return serviceManagerInstance.get<T, T>(service);
}