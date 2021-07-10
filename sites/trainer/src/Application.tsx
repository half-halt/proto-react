import "./app.scss"
import { NavigationDrawer } from "@hhf/ui";
import { Themed } from "@hhf/theme";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Home } from "./routes/home/Home";
import { Header } from "./components/header/Header";
import { useHeader } from "./components/header/useHeader";
import { lazy, Suspense } from 'react';

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
		<div className="logoHeader">Trainer</div>
	);
}

const NotFound = () => {
	useHeader('Page Not Found');

	return (
		<div>NOT FOUND</div>
	);
}

const LazyHorses = lazy(() => import("./routes/horses/Horses").then(m => ({ default: m.Horses })));

export function Application() {
	return (
		<BrowserRouter>
			<Themed>
				<Header />
				<NavigationDrawer header={<NavHeader/>} destinations={destinations}/>
				<main>
					<Suspense fallback={<div>loading...</div>}>
						<Routes>
							<Route path="/" element={<Home/>}/>
							<Route path="/horses/*" element={<LazyHorses/>}/>
							<Route element={<NotFound/>}/>
						</Routes>
					</Suspense>
				</main>
			</Themed>
		</BrowserRouter>		
	)	
}