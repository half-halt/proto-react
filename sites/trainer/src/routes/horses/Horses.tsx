import { FunctionalComponent } from "preact";
import Router, { Link } from "preact-router";
import { useHeader } from "../../components/header/useHeader";

const HorsesList: FunctionalComponent = () => {
	useHeader('Horses', [{ text: '+ Add', path: '/horses/create' }]);

	return (
		<div>horse list
		<Link href="/horses/x2dfgs">Horse link</Link>
		</div>
	)
}

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
			<HorsesList path="/horses"/>
			<ViewHorse path="/horses/:horse"/>
		</Router>
	)
}