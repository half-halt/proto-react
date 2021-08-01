import { FC, useEffect, useRef } from "react";
import { useAlbums } from "./albumsState";
import { Link } from "react-router-dom";
import { AreaHeader } from "../../components/AreaHeader/AreaHeader";

export const ViewAlbums: FC = () => {
	const hasMounted = useRef<boolean|null>();
	const albums = useAlbums();

	console.log("albuims", albums);

	useEffect(() => {
		if (!hasMounted.current) {
			hasMounted.current = true;
			if (location.hash) {
				const id = location.hash.substr(1);
				const el = document.getElementById(id);
				if (el) {
					// Ensure the new element is in view.
					el.scrollIntoView();
				}
			}
		}
	}, [albums, hasMounted.current])

	return (
		<>
			<AreaHeader title="Albums">
				<Link to={"create"}>Create</Link>
			</AreaHeader>
			<ul id="main" className="hhfAlbums">
				{albums.map(album => 
					<li key={album.id} className="hhfAlbum">
						<h2 id={album.id} >{album.name}</h2>
						<p>
							Album description Album description Album descriptionAlbum description Album descriptionAlbum descriptionAlbum descriptionAlbum description
						</p>
						<div id="actions">
							<Link to={`update/${album.id}`}>Edit</Link>
							<Link to={`delete/${album.id}`}>Delete</Link>
						</div>
					</li>
				)}
			</ul>
		</>
	)
}