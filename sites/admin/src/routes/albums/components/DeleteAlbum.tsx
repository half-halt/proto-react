import { FC, MouseEventHandler, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AreaHeader } from "../../../components/AreaHeader";
import { useAlbum, useDeleteAlbum } from "../albumsState";

function usePromise() {
	const promiseRef = useRef<Promise<any> | null>(null);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<Error|undefined>();

	const set = (promise: Promise<any>) => {
		promiseRef.current = promise;
		promise.then(
			(result: any) => {
				setError(undefined);
				return Promise.resolve(result);
			},
			(error) => {
				setError(error);
				return Promise.reject(error);
			}
		).catch(
			() => setPending(false)
		);
		setPending(true);
	}

	return {
		pending: (pending === true),
		error: (error || undefined),
		watch: set
	};
}

export const DeleteAlbum: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const album = useAlbum(params.albumId);
	const deleteAlbum = useDeleteAlbum();
	const {pending, error, watch} = usePromise();

	const handleConfirm: MouseEventHandler = (event) => {
		event.stopPropagation();
		event.preventDefault();

		watch(deleteAlbum(album).then(
			() => navigate('/albums')
		));
	}

	const handleCancel: MouseEventHandler = (event) => {
		event.stopPropagation();
		event.preventDefault();
		
		navigate(`/albums#${album.id}`);
	}

	return (
		<>
			<AreaHeader title="Delete Album"/>
			<main>
				<h2>Warning</h2>
				<p>Are you sure want to delete album "{album.name}"?</p>
				<p>This operation will not be reversible once you click delete the album (but not it's contents) will be removed.</p>

				<fieldset>
					<button onClick={handleCancel} disabled={pending} id="secondary" type="button">Cancel</button>
					<button onClick={handleConfirm} disabled={pending} type="button">Delete</button>
				</fieldset>
			</main>			
		</>
	)
}