import { FC } from "react";
import { Album  } from "@hhf/api";
import { AreaHeader } from "../../components/AreaHeader";
import { AlbumForm } from "./components/AlbumForm";
import { useNavigate } from "react-router";
import { albumIdsQuery, useAddAlbum } from "./albumsState";
import { useRecoilValue } from "recoil";
import { useLoadingPromise } from "@hhf/rx";

export const CreateAlbum: FC = () => {
	const navigate = useNavigate();
	const createAlbum = useAddAlbum();
	const albumIds = useRecoilValue(albumIdsQuery);
	const { loading, watch }  = useLoadingPromise();

	const handleAdd = (album: Album) => {
		// Make sure the album id is unique
		if (album.id && albumIds.includes(album.id)) {
			throw new Error(`The provided album identifier "${album.id}" is already in use please choose another or allow it to be auto-created`);
		} 

		// Create the album
		watch(
			createAlbum(album).then(
				(result) => navigate(`/albums#${result.id}`)
			)
		);
	}

	return (
		<>
			<AreaHeader title="Create Album"/>
			<main>
				<AlbumForm allowId onSubmit={handleAdd} disabled={loading}/>
			</main>
		</>
	)
}