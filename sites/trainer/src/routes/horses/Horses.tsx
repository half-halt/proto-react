import { FunctionalComponent } from "preact";
import Router from "preact-router";
import { useHeader } from "../../components/header/useHeader";
import { CreateHorse } from "./components/CreateHorse";
import { ViewHorses } from "./components/ViewHorses";

const ViewHorse: FunctionalComponent = () => {
	useHeader('Horse')
	return (
		<div>horse view</div>
	)
}


export const Horses: FunctionalComponent = (props: any) => {
	console.log('props', props);
	return (
		<Router>
			<ViewHorses path="/horses"/>
			<CreateHorse path="/horses/create"/>
			<ViewHorse path="/horses/:horse"/>
		</Router>
	)
}