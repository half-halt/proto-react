import { useLoadingPromise } from "@hhf/rx";
import { FC, MouseEventHandler, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AreaHeader } from "../../../components/AreaHeader";
import { useAlbum, useDeleteAlbum } from "../albumsState";

export const DeleteAlbum: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const album = useAlbum(params.albumId);
	const deleteAlbum = useDeleteAlbum();
	const {loading, error, watch} = useLoadingPromise();

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
					<button onClick={handleCancel} disabled={loading} id="secondary" type="button">Cancel</button>
					<button onClick={handleConfirm} disabled={loading} type="button">Delete</button>
				</fieldset>
			</main>			
		</>
	)
}