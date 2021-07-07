
export interface Horse {
	id: string;
	name: string;
	nickname?: string;
}

export type Horses = Array<Horse>;

export interface HorseUpdates {
	name?: string;
	nickname?: string;
}