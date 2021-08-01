import { LogService } from "@hhf/services";
import { ApiService } from "./ApiService";
import { query  } from 'faunadb';
import { nanoid } from "nanoid";
import { catchError, from, throwError } from "rxjs";
const { Call } = query;

export interface Album {
	readonly id: string;
	name: string;
}

export type WithOptionalId<T> = Omit<T, "id"> & { id?: string };
export type PartialWithId<T> = Partial<T> & { readonly id: string };

export class AlbumsClient {
	static Dependencies = [LogService, ApiService];

	constructor(
		private logger: LogService,
		private apiService: ApiService
	) {}

	getAlbums() {
		const client = this.apiService.getClient();
		this.logger.log('Querying server for all albums');

		return client.query<Album[]>(
			Call('GetAlbums')
		).catch(
			(error) => {
				this.logger.error('Failed to query all albums: {0}', error);
				return Promise.reject(error);
			}
		);
	}

	createAlbum(album: WithOptionalId<Album>, add: string[] = []) {
		const client = this.apiService.getClient();

		// If the caller didn't assign an ID to this album, then assign 
		// one here.
		if (typeof(album.id) !== 'string') {
			album.id = nanoid(10);
		}

		this.logger.log('Creating new album [{0}, {1}]', album.name, album.id);
		return client.query<Album>(
			Call('CreateAlbum', album, add)
		).catch(
			(error) => {
				this.logger.error('Failed create new album: [{0}', album.name);
				return Promise.reject(error);
			}
		);
	}

	updateAlbum(album: PartialWithId<Album>, add: string[] = [], remove: string[] = []) {
		const client = this.apiService.getClient();

		this.logger.log('Updating album [{0}, {1}]', album.name || '<unchanged>', album.id);
		return client.query<Album>(
			Call('UpdateAlbum', album, add, remove)
		).catch(
			(error) => {
				this.logger.log('Failed to update album: [{0}]', album.id);
				return Promise.reject(error);
			}
		)
	}

	updateAlbum2(album: PartialWithId<Album>, add: string[] = [], remove: string[] = []) {
		const client = this.apiService.getClient();

		this.logger.log('Updating album [{0}, {1}, {2}/{3}]', album.name || '<unchanged>', album.id, add.length, remove.length);
		return from(client.query<Album>(Call("UpdateAlbum", album, add, remove))).pipe(
			catchError(error => {
				this.logger.error('Failed to update album [{0}]: {1}', album.id, String(error));
				return throwError(() => error);
			})
		);
	}

	deleteAlbum(album: Album) {
		const client = this.apiService.getClient();

		this.logger.log('Deleteing album [{0}, {1}]', album.name, album.id);
		return client.query(
			Call('DeleteAlbum', album.id)
		).catch(
			(error) => {
				this.logger.error('Failed to delete album [{0}]: {1}', album.id, String(error));
				return Promise.reject(error);
			}
		);
	}
}