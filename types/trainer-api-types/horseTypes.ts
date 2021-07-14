
type ImageInfo = {
	id: string;
	url: string;
}

export interface Horse {
	id: string;
	name: string;
	nickname?: string;
	image?: ImageInfo;
}

export type Horses = Array<Horse>;

export interface HorseUpdates {
	name?: string;
	nickname?: string;
	image?: ImageInfo;
}