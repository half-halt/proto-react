import { FormEventHandler, FunctionComponent, useState } from "react";
import { useHeader } from "../../../components/header/useHeader";
import { useService } from "@hhf/services";
import { BlobClient, HorsesClient } from "@hhf/api";
import { ImageChooser } from "@hhf/image-ui";
import { FormControl, useForm } from "@hhf/forms";
import * as Yup from 'yup';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { horsesState, tokenState } from "../../../states/horses";
import { HorseUpdates } from "@hhf/trainer-api-types";
//import { Horse, HorseUpdates } from "types/trainer-api-types";

const schema = Yup.object().shape({
	name: Yup.string()
	  .required('The name field is required')
	  .min(3, 'The name field must be at least 3 characters long'),
	nickname: Yup.string().required('nah'),
	image: Yup.object().optional(),
  });

export const CreateHorse: FunctionComponent = () => {
	useHeader('Create Horse');
	const horseApi = useService(HorsesClient);
	const blobClient = useService(BlobClient);
	const { register, validate, value, errors } = useForm<HorseUpdates>({schema});
	const token = useRecoilValue(tokenState);
	const setHorses = useSetRecoilState(horsesState);
	const [loading, setLoading] = useState(false);

	console.log(value);

	const addHorse = (horse: HorseUpdates) => {
		return horseApi.create(horse as any).then(
			(horse) => {
				setHorses((currentList) => [
					...currentList,
					horse
				])
			},
			(error) => {
				console.log('error')
			}
		);
	}

	
	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const { value, valid } = validate();
		if (valid) {
			setLoading(true);
			addHorse(value).then(() => {
				setLoading(false)
			});
		}
	}

	return (
		<form className="hhf-editHorseForm" onSubmit={handleSubmit}>
			<FormControl label='Image:'>
				<input name="image" type="file" ref={register}/>
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
				{loading && 
					<div id="loading">
						Loading...
					</div>
				}
				<button>Create</button>
			</div>
		</form>
	);
}