import { FC, Suspense } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import './albums.scss';
import { DeleteAlbum } from './components/DeleteAlbum';
import { CreateAlbum } from './CreateAlbum';
import { ViewAlbums } from './ViewAlbums';


export const Albums: FC = () => {
	const route = useParams();
	console.log('routes:', route);
	return (
		<Suspense fallback={<div>loading...</div>}>
			<Routes>
				<Route path="/" element={<ViewAlbums/>}/>
				<Route path="/create" element={<CreateAlbum/>}/>
				<Route path="/delete/:albumId" element={<DeleteAlbum/>}/>
			</Routes>
		</Suspense>
	)
}