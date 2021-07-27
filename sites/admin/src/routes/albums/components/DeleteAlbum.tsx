import { FC } from "react";
import { useParams } from "react-router-dom";
import { AreaHeader } from "../../../components/AreaHeader";

export const DeleteAlbum: FC = () => {
	const params = useParams();
	console.log("params", params);

	return (
		<>
			<AreaHeader title="Delete Album"/>
			<div>
				<h1>Delete Album</h1>
				Delete Album: {params.albumId}
			</div>
		</>
	)
}