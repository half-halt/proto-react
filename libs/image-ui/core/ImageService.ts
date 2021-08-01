import { of } from "rxjs"

type ImageSize = {
	width: number;
	height: number;
	key: string;
}

interface Images {
	maxWidth: number;
	maxHeight: number;
	sizes: ImageSize[];
}

export class ImageService {

	getImageInfo() {
		return of<Images>({
			maxWidth: 1920,
			maxHeight: 1920,
			sizes: [
				{
					key: 'thumbnail',
					width: 64,
					height: 64
				},
				{
					key: 'small',
					width: 256,
					height: 256,
				},
				{
					key: 'medium',
					width: 512,
					height: 512,
				},
				{
					key: 'large',
					width: 1024,
					height: 1024,
				}
			]
		});
	}
}