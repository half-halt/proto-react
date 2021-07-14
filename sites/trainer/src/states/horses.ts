import { HorsesClient } from "@hhf/api";
import { getService } from "@hhf/services";
import { Horse, Horses } from "@hhf/trainer-api-types";
import { atom, selector, selectorFamily } from "recoil";
import { firstValueFrom } from "rxjs";

const horsesApi = getService(HorsesClient);

export const tokenState = atom<string>({
	key: 'Token',
	default: ''
});

export const horsesState = atom<Horses>({
	key: 'HorsesList',
	default: horsesApi.horses()
});

export const horseState = selectorFamily<Horse, string>({
	key: 'Horse',
	get: (horseId) => ({get}) => {
		const horses = get(horsesState);
		const horse = horses.find(horse => horse.id === horseId);
		if (horse)
			return horse;

		throw new Error('horse not found');
	}
})