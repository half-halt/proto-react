import { useService } from "@hhf/services";
import { forkJoin, Observable } from "rxjs";
import { CreateImageResult, createImage } from "./createImage";
import { ImageService } from "./ImageService";

export function useCreateImages() {
	const imageSvc = useService(ImageService);

	/*interface Image extends CreateImageResult {
		key: string;
	}*/

	return (source: File | Blob) => new Promise<CreateImageResult[]>(
		(resolve, reject) => {
			imageSvc.getImageInfo().subscribe({
				next: (images) => {
					const results: Observable<CreateImageResult>[] = [];
					
					results.push(createImage({ 
						source,
						width: images.maxWidth,
						height: images.maxHeight
					}));
					
					images.sizes.forEach(size => {
						results.push(createImage({
							source,
							width: size.width,
							height: size.height
						}))
					});

					forkJoin(results).subscribe(
						(result) => {
							resolve(result);
						}
					);
				},
				error: reject
			});
		});
}