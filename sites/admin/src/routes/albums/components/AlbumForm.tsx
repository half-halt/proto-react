import { Album, AlbumsClient } from "@hhf/api";
import { FormControl, useForm } from "@hhf/forms";
import { useService } from "@hhf/services";
import { nanoid } from "nanoid";
import { FC, FormEventHandler, useEffect, useState } from "react";
import { albumIdsQuery, useAddAlbum } from "../albumsState";
import { isFunction } from 'lodash';
import * as Yup from 'yup';
import { useRecoilValue } from "recoil";
import { retryWhen } from "rxjs";

const schema = Yup.object().shape({
	id: Yup.string()
		.transform((value) => {
			if (typeof(value) === "string") {
				const s = value.trim();
				if (value.length === 0) {
					return undefined;
				}
			}
			return value;
		})
		.optional()
		.matches(/([a-z][a-z0-9-_]+)/i, "An album identifier must start with a letter and can only contain letters, numbers, underscores and dashes."),
	name: Yup.string()
		.required("An album name is required.")
		.min(3, "An album name must be a minum of three characters")
});

interface AlbumFormProps {
	allowId?: boolean;
	disabled?: boolean;
	onSubmit: (album: Album) => Promise<any> | any;
	error?: Error | null;
	album?: Album;
	action?: string;
}

export const AlbumForm: FC<AlbumFormProps> = ({ allowId, onSubmit, disabled, error, album, action }) => {
	const { register, validate, errors } = useForm<Album>({schema, defaultValues: album });
	const [progress, setProgress] = useState(false);
	const [createError, setCreateError] = useState<Error | null>(null);
	const albumIds = useRecoilValue(albumIdsQuery);

	// If we are given an error, it takes priority over any error that have.
	useEffect(() => {
		if (error instanceof Error) {
			setCreateError(error);
		}
	}, [error]);

	// Handle submittting the form
	const handleSubmit: FormEventHandler = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const { valid, value } = validate();
		if (valid) {
			try {
				const result = onSubmit(value);
				if (Promise.resolve(result) === result) {
					result.catch(setCreateError)
				}
			} catch (error) {
				setCreateError(error as Error);
			}
		}
	}
		
	return (
		<form onSubmit={handleSubmit}>
			
			{allowId &&
				<FormControl label="Id:" errors={errors.id} 
					help="You can optionally provide an identifier for the new album, this must be unique. This can be left blank and a random identifier will be generated.">
					<input name="id" type="text" ref={register} disabled={disabled}/>
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

			<FormControl label="Description:" errors={errors.description}>
				<textarea disabled={disabled} name="description" ref={register as any}></textarea>
			</FormControl>

			{createError && 
				<div>{createError.message}</div>
			}

			<div className="actions">
				{progress && <div>Creating...</div>}
				<button type="submit" disabled={progress}>
					{action}
				</button>
			</div>
		</form>
	);
};

AlbumForm.defaultProps = {
	action: "Create"
};
