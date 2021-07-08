import { FunctionalComponent } from "preact";
import { useHeader } from "../../../components/header/useHeader";
import { useService } from "@hhf/services";
import { BlobClient } from "@hhf/api";
import { ImageChooser } from "@hhf/image-ui";
//import { Horse, HorseUpdates } from "types/trainer-api-types";


export const CreateHorse: FunctionalComponent = () => {
	//const horsesClient = useService(HorsesClient)
	const blobClient = useService(BlobClient);
	useHeader('Create Horse');

	const handleSubmit: HTMLFormElement['onsubmit'] = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const image = (event.target as HTMLFormElement).elements.namedItem('image') as HTMLInputElement;
		if (image.files && image.files[0]) {
			const fd = new FormData();
			fd.append('query', 'mutation { createHorse }');
			fd.append('variables', JSON.stringify({ image: 'cid:xxx' }));
			fd.append('xxx', image.files[0]);
			fetch('http://localhost:4044/.netlify/functions/trainer-api', {
				method: 'POST',
				body: fd
			});


			blobClient.save('horses', image.files[0]).subscribe(
				console.log
			);
		}

	}

	return (
		<form onSubmit={handleSubmit}>
			<ImageChooser previewHeight="256" previewWidth="256"/>
			<div class="actions">
				<button>Create</button>
			</div>
		</form>
	);
}