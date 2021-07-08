
export function renderPreview(canvas: HTMLCanvasElement, source: HTMLImageElement) {
	let width = source.width;
	let height = source.height;
	let top = 0;
	let left = 0;

	console.log("-->", canvas.width, canvas.height)

	const scale = Math.min(canvas.width / width, canvas.height / height);
	if (scale <= 1) {
		width = Math.floor(width * scale);
		height = Math.floor(height * scale);
	}

	left = Math.ceil((canvas.width - width) / 2);
	top = Math.ceil((canvas.height - height) / 2);
	console.log(scale, left, top, width, height);

	const render = canvas.getContext('2d');
	if (render) {
		render.clearRect(0, 0, canvas.width, canvas.height);
		render.drawImage(source, 0, 0, source.width, source.height,	left, top, width, height);
	}
}