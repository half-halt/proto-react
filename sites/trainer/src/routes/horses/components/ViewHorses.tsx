import { FunctionComponent } from "react";
import { useHeader } from "../../../components/header/useHeader";
import { getService, useService } from "@hhf/services";
import { HorsesClient } from "@hhf/api";
import { useResource } from "@hhf/rx";
import { Link } from "react-router-dom";
import { HorseCard } from "../../../components/HorseCard";
import {  useRecoilValue  } from 'recoil';
import { horsesState } from "../../../../src/states/horses";


export const ViewHorses: FunctionComponent = () => {
	useHeader('Horses', [
		{ text: '+ Add', path: '/horses/create' }
	]);

	const horses = useRecoilValue(horsesState);

	return (
		<div>
		<ul>
			{horses.map(horse => (
				<HorseCard key={horse.id} horse={horse}/>
			))}
		</ul>
		</div>
	);
}