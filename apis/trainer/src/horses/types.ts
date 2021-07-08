import { Horses, Horse, HorseUpdates } from "types/trainer-api-types/horseTypes";

export interface GetHorseArgs {
	id: string;
}

export interface CreateHorseInput {
	name: string;
	nickname?: string;
}

export interface CreateHorseArgs {
	data: CreateHorseInput;
}

export interface CreateHorseArgs {
	create: CreateHorseInput
}

export interface UpdateHorseInput {
	name?: string;
	nickname?: string;
}

export interface UpdateHorseArgs {
	id: string;
	updates: UpdateHorseInput;
}

export interface DeleteHorseArgs {
	id: string;
}

export type { Horses, Horse, HorseUpdates };