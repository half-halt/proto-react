import { FormEventHandler, FunctionComponent } from "react";
import { useHeader } from "../../../components/header/useHeader";
import { useService } from "@hhf/services";
import { BlobClient } from "@hhf/api";
import { ImageChooser } from "@hhf/image-ui";
import { FormControl, useForm } from "@hhf/forms";
import * as Yup from 'yup';
//import { Horse, HorseUpdates } from "types/trainer-api-types";

const schema = Yup.object().shape({
	name: Yup.string()
	  .required('The name field is required')
	  .min(3, 'The name field must be at least 3 characters long'),
	nickname: Yup.string().required('nah')
  });

export const CreateHorse: FunctionComponent = () => {
	//const horsesClient = useService(HorsesClient)
	const blobClient = useService(BlobClient);
	const { register, validate, value, errors } = useForm({schema});

	useHeader('Create Horse');

	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const image = (event.target as HTMLFormElement).elements.namedItem('image') as HTMLInputElement;
		if (image.files && image.files[0]) {


			blobClient.save('horses', image.files[0]).subscribe(
				console.log
			);
		}

	}

	return (
		<form onSubmit={handleSubmit}>
			<FormControl label='Image:'>
				<ImageChooser previewHeight="256" previewWidth="256"/>
			</FormControl>

			<FormControl label="Name:" errors={errors?.name}>
				<input name="name" ref={register} type='text' />
			</FormControl>

			<FormControl 
				errors={errors?.nickname}
				label="Nickname:"
				help="Nick name help"
			>
				<input name="nickname" ref={register} type='text'/>
			</FormControl>


			<div className="actions">
				<button>Create</button>
			</div>
		</form>
	);
}