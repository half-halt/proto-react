import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import './albums.scss';
import { DeleteAlbum } from './components/DeleteAlbum';
import { UpdateAlbum } from './components/UpdateAlbum';
import { CreateAlbum } from './CreateAlbum';
import { ViewAlbums } from './ViewAlbums';


export const Albums: FC = () => {
	return (
		<Routes>
			<Route path="/" element={<ViewAlbums/>}/>
			<Route path="/create" element={<CreateAlbum/>}/>
			<Route path="/delete/:albumId" element={<DeleteAlbum/>}/>
			<Route path="/update/:albumId" element={<UpdateAlbum/>}/>
		</Routes>
	)
}