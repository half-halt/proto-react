import { getService } from "@hhf/services";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { Album, AlbumsClient } from "@hhf/api";
const albumsApi = getService(AlbumsClient);

export const albumsState = atom<Album[]|null>({
	key: 'albums',
	default: null,
});

export const albumsList = selector<Album[]>({
	key: 'albumsList',
	get: ({get, getCallback}) => {
		const list = get(albumsState);
		if (list === null) {
			return albumsApi.getAlbums();
		}

		return list;
	}
});

export function useAlbums() {
	return useRecoilValue(albumsList);
}

export function useAddAlbum() {
	const updateList = useSetRecoilState(albumsState);
	return (album: Album) => {
		updateList(list => {
			if (!list) {
				return [album];
			}
			return list.concat(album);
		});
	}
}