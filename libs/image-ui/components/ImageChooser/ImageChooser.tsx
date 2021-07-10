import { ChangeEventHandler, FunctionComponent } from "react";
import { useState, useRef } from "react";
import { ImageChooserProps } from "./ImageChooserProps";
import './chooser.scss';
import { fromEvent } from "rxjs";
import { renderPreview } from "./renderPreview";

export const ImageChooser: FunctionComponent<ImageChooserProps> = ({
	image,
	ref,
	previewHeight,
	previewWidth
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [file, setFile] = useState<File|null>(null);
	const [sourceImage, setSourceImage] = useState<HTMLImageElement|null>(null);
	

	const handleChange: ChangeEventHandler = (event) => {
		console.log('handle change');

		const target = event.target as HTMLInputElement;
		if (!target.files || !target.files[0]) {
			setSourceImage(null);
		} else {
			const image = new Image();
			fromEvent(image, "load").subscribe(
				() => { 
					setSourceImage(image);
					if (canvasRef.current) {
						renderPreview(canvasRef.current, image);
					}
				}
			)
			
			image.src = URL.createObjectURL(target.files[0]);
		}

	}

	return (
		<div className="hhf-imageChooser">
			<canvas width={previewWidth} height={previewHeight} ref={canvasRef}  className={!sourceImage ? 'noImage' : ''}/>
			<input id="fileInput" type="file" onChange={handleChange}></input>
		</div>
	);
}