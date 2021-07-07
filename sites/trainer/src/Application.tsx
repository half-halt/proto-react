import "./app.scss"
import { NavigationDrawer } from "@hhf/ui";
import { Themed } from "@hhf/theme";
import { Route, Router } from 'preact-router';
import { Home } from "./routes/home/Home";
import AsyncRoute from 'preact-async-route';
import { Header } from "./components/header/Header";
import { useHeader } from "./components/header/useHeader";

const destinations = [
	{ path: '/', text: 'Home' },
	{ path: '/horses', text: 'Horses' },
	{ path: '/trainers', text: 'Trainers' },
	{ path: '/riders', text: 'Riders' },
	{ path: '/lesson', text: 'Lessons' },
	{ path: '/sessions', text: 'Training' },
];

const NavHeader = () => {
	return (
		<div class="logoHeader">Trainer</div>
	);
}

const NotFound = () => {
	useHeader('Page Not Found');

	return (
		<div>NOT FOUND</div>
	);
}

export function Application() {
	return (
		<Themed>
			<Header />
			<NavigationDrawer header={<NavHeader/>} destinations={destinations}/>
			<main>
				<Router>
					<Route path="/" component={Home}/>
					<AsyncRoute 
						path="/horses/:rest*"
						getComponent={() => import('./routes/horses/Horses').then(module => module.Horses)}
						/>
					<Route default component={NotFound}/>
				</Router>
			</main>
		</Themed>
	)	
}