import { LogService } from "@hhf/services";
import { BlobServiceClient } from "@azure/storage-blob";
import { Observable, throwError } from "rxjs";
import { nanoid } from "nanoid";

interface BlobInfo {
	id: string;
	url: string;
}

export class BlobClient {
	static Dependencies = [LogService];
	private _client?: BlobServiceClient;

	constructor(
		private logger: LogService
	) {}

	private createClient = () => {
		if (!this._client) {
			console.log(process.env.BLOB_STORAGE_URL);
			this._client = new BlobServiceClient(process.env.BLOB_STORAGE_URL!);
		}
		return this._client;
	}

	private getContainer = async (container: string) => {
		const client = this.createClient();
		const containerClient = client.getContainerClient(container);
		const result = await containerClient.createIfNotExists({ access: 'blob' });
		console.dir(result);
		if (!result.succeeded && (result.errorCode !== 'ContainerAlreadyExists')) {
			throw new Error()
		}

		return containerClient;
	}

	/**
	 * Save the specified blob into the container, returns the URL required to access
	 * the blob.
	 */
	save = (container: string, contents: File | Blob) : Observable<BlobInfo> => {
		this.logger.log('BlobClient: saving new blob container="{0}", type="{1}"', container, contents.type);
		
		return new Observable<BlobInfo>(subject => {
			const id = nanoid(32);
			this.getContainer(container).then(
				client => {
					const blobClient = client.getBlockBlobClient(id);
					blobClient.uploadData(contents, {
							blobHTTPHeaders: {
								blobContentType: contents.type,
							},
							onProgress(progress) {
								console.log("--> progress", id, "bytes", progress.loadedBytes);
							}
						}).then(
						result => {
							const index = blobClient.url.indexOf('?');
							subject.next({ url: blobClient.url.substring(0, index), id });
							subject.complete();
						},
						error => {
							subject.error(error);
							subject.complete();
						}
					)
				},
				error => {
					subject.error(error);
					subject.complete();
				}
			);
		});
	}

	delete = (blobId: string): Observable<any> => {
		this.logger.log('BlobClient: deleting blob "{0}"', blobId);
		return throwError(() => new Error('not-yet-implemented'));
	}

	getUrl = (blobId: string): Observable<string> => {
		this.logger.log('BlobClient: retrieving blob url "{0}', blobId);
		return throwError(() => new Error('not-yet-implemented'));
	}
}