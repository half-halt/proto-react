import { Album } from "@hhf/api";
import { useLoadingPromise } from "@hhf/rx";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AreaHeader } from "../../../components/AreaHeader";
import { useAlbum, useDeleteAlbum, useUpdateAlbum } from "../albumsState";
import { AlbumForm } from "./AlbumForm";

export const UpdateAlbum: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const album = useAlbum(params.albumId);
	const updateAlbum = useUpdateAlbum();
	const {loading, error, watch} = useLoadingPromise();

	const handleUpdate = (newAlbum: Album) => {
		console.log('update:', newAlbum);
		watch(
			updateAlbum(Object.assign({}, newAlbum, { id: album.id }), [], []).then(
				(result) => navigate(`/albums#${result.id}`)
			)
		);
	}

	return (
		<>
			<AreaHeader title={`${album.name} - Update`}/>
			<main>
				<AlbumForm action="Save" disabled={loading} album={album} onSubmit={handleUpdate} error={error} />
			</main>
		</>
	)
}