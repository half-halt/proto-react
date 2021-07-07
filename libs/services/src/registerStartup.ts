import { serviceManagerInstance, ServiceType } from "./instance";
import { logService } from "./services/LogService";
import { OnStartup } from "./interfaces";

/**
 * Registers a startup service, meaning it holds rendering of the children until
 * it has finished initializing.
 * 
 * @param startupService The service to register a startup service, needs to inherit from OnStartup
 */
export function registerStartup<T extends OnStartup>(startupService: ServiceType<T>) {
	logService.log('Registering startup service "{0}"', startupService.name);
	return serviceManagerInstance.registerStartup(startupService);
}