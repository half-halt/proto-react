import { FC } from "react";
import { Album  } from "@hhf/api";
import { AreaHeader } from "../../components/AreaHeader";
import { AlbumForm } from "./components/AlbumForm";
import { useNavigate } from "react-router";

export const CreateAlbum: FC = () => {
	const navigate = useNavigate();

	const handleAdd = (album: Album) => {
		navigate(`/albums#${album.id}`);
	}

	return (
		<>
			<AreaHeader title="Create Album"/>
			<main>
				<AlbumForm allowId onSubmit={handleAdd}/>
			</main>
		</>
	)
}