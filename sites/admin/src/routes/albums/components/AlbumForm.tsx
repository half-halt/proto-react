import { Album, AlbumsClient } from "@hhf/api";
import { FormControl, useForm } from "@hhf/forms";
import { useService } from "@hhf/services";
import { nanoid } from "nanoid";
import { FC, FormEventHandler, useState } from "react";
import { useAddAlbum } from "../albumsState";
import { isFunction } from 'lodash';

interface AlbumFormProps {
	allowId: boolean;
	onSubmit?: (album: Album) => void;
}

export const AlbumForm: FC<AlbumFormProps> = ({ allowId, onSubmit }) => {
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
				(album) => {
					addAlbum(album);
					if (isFunction(onSubmit)) {
						onSubmit(album);
					}
				}
			).finally(
				() => setProgress(false)
			);
		}
	}
		
	return (
		<form onSubmit={handleSubmit}>
			
			{allowId &&
				<FormControl label="Id:" errors={errors.id} 
					help="You can optionally provide an identifier for the new album, this must be unique. This can be left blank and a random identifier will be generated.">
					<input name="id" type="text" ref={register} disabled={progress}/>
				</FormControl>
			}

			<FormControl label="Name:" errors={errors.name}>
				<input
					name="name"
					type="text"
					ref={register}
					disabled={progress}
				/>
			</FormControl>

			<div className="actions">
				{progress && <div>Creating...</div>}
				<button type="submit" disabled={progress}>
					Create
				</button>
			</div>
		</form>
	);
};
