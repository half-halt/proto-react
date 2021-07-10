import { HorsesClient } from "@hhf/api";
import { getService } from "@hhf/services";
import { Horse, Horses } from "@hhf/trainer-api-types";
import { atom, selector, selectorFamily } from "recoil";
import { firstValueFrom } from "rxjs";

const horsesApi = getService(HorsesClient);

const tokenState = atom<string>({
	key: 'Token',
	default: ''
});

export const horsesState = selector<Horses>({
	key: 'HorsesList',
	get: ({get}) => {
		const token = get(tokenState);
		return horsesApi.horses(token);
	}	
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