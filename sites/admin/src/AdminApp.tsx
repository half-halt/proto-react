import { FC } from "react";
import { Authentication } from "@hhf/auth";
import { Themed } from "@hhf/theme";
import { Routes, Route } from "react-router-dom";
import { Albums } from './routes/albums';
import './AdminApp.scss';

export const AdminApp: FC = () => {
	return (
		<Themed>
			<Authentication require>
				<div id="app">
					<Routes>
						<Route path="/albums/*" element={<Albums/>}/>
					</Routes>
				</div>
			</Authentication>
		</Themed>		
	)
}