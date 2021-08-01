import { getService } from "@hhf/services";
import { atom, DefaultValue, selector, selectorFamily, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { Album, AlbumsClient } from "@hhf/api";
import { isTokenCredential } from "@azure/core-auth";
import { nanoid } from "nanoid";
import { WithOptionalId } from "libs/api/src/AlbumsClient";
import { lastValueFrom, tap } from "rxjs";
const albumsApi = getService(AlbumsClient);

export const albumsState = atom<Album[]|null>({
	key: 'albums',
	default: null,
});

function compareAlbums(a: Album, b: Album) {
	const an = a.name.trim().toLowerCase();
	const bn = b.name.trim().toLowerCase();
	
	if (an < bn) {
		return -1;
	} else if (an > bn) {
		return 1;
	}

	return 0;
}

export const albumsList = selector<Album[]>({
	key: 'albumsList',
	get: ({get, getCallback}) => {
		const list = get(albumsState);
		if (list === null) {
			return albumsApi.getAlbums().then(
				(albums) => albums.sort(compareAlbums)
			);
		}

		return list;
	},
	set: ({ set }, albums) => {
		if (albums instanceof DefaultValue) {
			set(albumsState, null);
		} else {
			set(albumsState, albums.sort(compareAlbums))
		}	
	}
});

export const albumIdsQuery = selector<string[]>({
	key: "albumIds",
	get: ({get}) => {
		const list = get(albumsList);
		return (list || []).map(album => album.id);
	},
})

export const albumQuery = selectorFamily<Album, string>({
	key: 'album',
	get: (albumId: string) => ({get}) => {
		const items = get(albumsList);
		return items.find(album => album.id === albumId) as Album;
	}
});

export function useAlbums() {
	return useRecoilValue(albumsList);
}

export function useAlbum(albumId: string) {
	return useRecoilValue(albumQuery(albumId));
}

export function useAddAlbum() {
	const updateList = useSetRecoilState(albumsList);	
	return (album: WithOptionalId<Album>, contents: string[] = []) => {
		// If the album doesn't yet have an ID then generate one
		if (!album.id) {
			album.id = nanoid(10);
		}

		return albumsApi.createAlbum(album, contents).then(
			album => {
				// On success add the item to our list
				updateList(current => {
					if (current) {
						return current.concat(album).sort(compareAlbums);
					} else {
						return [album]
					}
				});
				return Promise.resolve(album);
			});
	}
}

export function useUpdateAlbum() {
	const updateList = useSetRecoilState(albumsList);
	return (album: Album, add: string[] = [], remove: string[])  => {
		return lastValueFrom(albumsApi.updateAlbum2(album, add, remove).pipe(
			tap(
				(album: Album) =>
					updateList(current => {
						return current.map(a => {
							if (a.id == album.id) {
								return album;
							}

							return a;
						})
					}
				)
			)
		));
	}
}

export function useDeleteAlbum() {
	const updateList = useSetRecoilState(albumsList);
	return (album: Album) => {
		return albumsApi.deleteAlbum(album).then(
			(result) => {
				// On success remove the item from the list
				updateList(list => {
					return list.filter(a => a.id !== album.id)
				});

				return Promise.resolve(result);
			}
		)
	}
}