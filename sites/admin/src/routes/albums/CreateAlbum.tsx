import { FC, FormEventHandler, useState } from "react";
import { useForm, FormControl  } from "@hhf/forms";
import { albumsState, useAddAlbum } from "./albumsState";
import { Album, AlbumsClient } from "@hhf/api";
import { nanoid } from "nanoid";
import { useService } from "@hhf/services";
import { AreaHeader } from "../../components/AreaHeader";

export const CreateAlbum: FC = () => {
	const { register, validate, errors } = useForm<Album>({});
	const [progress, setProgress] = useState(false);
	const albumApi = useService(AlbumsClient);
	const addAlbum = useAddAlbum();

	const handleSubmit: FormEventHandler = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const { valid, value } = validate();
		if (valid) {
			setProgress(true);
			value.id = nanoid(10);
			albumApi.createAlbum(value).then(
				(album) => addAlbum(album)
			).finally(
				() => setProgress(false)
			);
		}
	}

	return (
		<>
			<AreaHeader title="Create Album"/>
			<main>
				<form onSubmit={handleSubmit}>
					<h1>Create Album</h1>
					<FormControl label="Name:" errors={errors.name}>
						<input name="name" type="text" ref={register} disabled={progress}/>
					</FormControl>

					<div className="actions">
						{progress && <div>Creating...</div>}
						<button type="submit" disabled={progress}>Create</button>
					</div>
				</form>
			</main>
		</>
	)
}