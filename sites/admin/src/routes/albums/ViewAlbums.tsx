import { FC } from "react";
import { useAlbums } from "./albumsState";
import { Link } from "react-router-dom";
import { AreaHeader } from "../../components/AreaHeader/AreaHeader";

export const ViewAlbums: FC = () => {
	const albums = useAlbums();
	return (
		<>
			<AreaHeader title="Albums">
				<Link to={"create"}>Create</Link>
			</AreaHeader>
			<ul className="hhfAlbums">
				{albums.map(album => 
					<li key={album.id} className="hhfAlbum">
						<h2>{album.name}</h2>
						<p>
							Album description Album description Album descriptionAlbum description Album descriptionAlbum descriptionAlbum descriptionAlbum description
						</p>
						<div id="actions">
							<Link to={`edit/${album.id}`}>Edit</Link>
							<Link to={`delete/${album.id}`}>Delete</Link>
						</div>
					</li>
				)}
			</ul>
		</>
	)
}