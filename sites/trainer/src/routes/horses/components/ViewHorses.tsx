import { FunctionComponent } from "react";
import { useHeader } from "../../../components/header/useHeader";
import { getService, useService } from "@hhf/services";
import { HorsesClient } from "@hhf/api";
import { useResource } from "@hhf/rx";
import { Link } from "react-router-dom";

import {  useRecoilValue  } from 'recoil';

import { horsesState } from "../../../../src/states/horses";


export const ViewHorses: FunctionComponent = () => {
	//const horsesClient = useService(HorsesClient)
	//const { data, loading, error } = useResource(horsesClient.getHorses);
	
	useHeader('Horses', [
		{ text: '+ Add', path: '/horses/create' }
	]);

	console.log("--> update");
	const horses = useRecoilValue(horsesState);

	/*if (loading) {
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
	 }*/


	return (
		<div>
		<ul>
			{horses.map(horse => (
				<li key={horse.id}><Link to={`/horses/${horse.id}`}>{horse.name}</Link></li>	
			))}
		</ul>
		</div>
	);
}