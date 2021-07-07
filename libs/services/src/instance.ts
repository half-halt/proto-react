import { ServiceManager } from "./ServiceManager";

export type ServiceType<T> = new(...args: any[]) => T;
export const serviceManagerInstance = new ServiceManager();