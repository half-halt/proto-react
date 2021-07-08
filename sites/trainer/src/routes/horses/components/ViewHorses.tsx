import { FunctionalComponent } from "preact";
import { useHeader } from "../../../components/header/useHeader";
import { useService } from "@hhf/services";
import { HorsesClient } from "@hhf/api";
import { useResource } from "@hhf/rx";


export const ViewHorses: FunctionalComponent = () => {
	const horsesClient = useService(HorsesClient)
	const { data, loading, error } = useResource(horsesClient.getHorses);

	useHeader('Horses', [
		{ text: '+ Add', path: '/horses/create' }
	]);

	if (loading) {
		return (
			<div>loading...</div>
		);
 	} else if (error) {
		return (
			<div>Error: {String(error)}</div>
		);
	 } else if (data?.length == 0) {
		 return (
			 <div>empty</div>
		 );
	 }


	return (
		<ul>
			{data?.map(horse => (
				<li>{horse.name}</li>	
			))}
		</ul>
	);
}