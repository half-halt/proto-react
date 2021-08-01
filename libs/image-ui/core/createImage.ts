import { Observable } from "rxjs";

interface CreateImageParams {
	source: File | Blob;
	width?: number;
	height?: number;
	fill?: boolean;
}

export interface CreateImageResult {
	image: Blob;
	width: number;
	height: number;
	scale: number;
}

/**
 * Scale the item down (or up) to fill the specified space.
 * 
 * @param width The width of the item
 * @param height The height of the item
 * @param viewWidth The width of the view
 * @param viewHeight The height of the view
 * @param fill Scale up to fill the view
 * @returns width and height of the item to fit the bounds
 */
export function scaleItem(width: number, height: number, viewWidth: number, viewHeight: number, fill: boolean = false) {
	const scale = Math.min(viewWidth / width, viewHeight / height );
	if ((scale >= 1) && !fill) {
		return { width, height, scale: 1 }
	}

	return {
		width: Math.floor(width * scale),
		height: Math.floor(height * scale),
		scale,
	};
}

export function createImage(params: CreateImageParams) {
	return new Observable<CreateImageResult>(subject => {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (!context) {
			subject.error('Unable to retrieve 2d context for the canvase');
			return;
		}

		const url = URL.createObjectURL(params.source);
		const image = new Image();

		image.onload = () => {
			const cx = params.width || image.width;
			const cy = params.height || image.height;
			const { width, height, scale } = scaleItem(image.width, image.height, cx, cy, false);

			canvas.width = width;
			canvas.height = height;
			context?.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

			canvas.toBlob(blob => {
				if (!blob) {
					subject.error('Unable to create image from canvas');
					return;
				}

				subject.next({
					width, height, scale,
					image: blob
				});
				subject.complete();

			}, 'image/jpeg');
		}

		image.src = url;
	});
}