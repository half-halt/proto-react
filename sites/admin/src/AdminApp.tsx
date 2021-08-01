import { FC, FormEventHandler, Suspense } from "react";
import { Authentication } from "@hhf/auth";
import { Themed } from "@hhf/theme";
import { Routes, Route } from "react-router-dom";
import { Albums } from './routes/albums';
import './AdminApp.scss';

import { useCreateImages } from "@hhf/image-ui";
import { useLoadingPromise } from "@hhf/rx";

const Test: FC = () => {
	const createImages = useCreateImages();
	const { loading, watch } = useLoadingPromise();

	const handleTest: FormEventHandler = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const file = (event.target as HTMLFormElement).elements.item(0) as HTMLInputElement;
		if (file && file.files && file.files.length === 1) {
			watch(createImages(file.files[0]).then((images) => {
				images.forEach(img => {
					const i = new Image();
					i.src = URL.createObjectURL(img.image);
					document.body.appendChild(i);
				})
				return Promise.resolve(images);
			}));
		}
	}

	return (
		<form onSubmit={handleTest}>
			<input type="file" />

			<button type="submit">est</button>
			{loading &&
				<div>LOADING...</div>
			}
		</form>
	)
}

export const AdminApp: FC = () => {
	return (
		<Themed>
			<Authentication require>
				<div id="app">
					<Suspense fallback={<div>loading.......</div>}>
						<Routes>
							<Route path="/" element={<Test/>}/>
							<Route path="/albums/*" element={<Albums/>}/>
						</Routes>
					</Suspense>
				</div>
			</Authentication>
		</Themed>		
	)
}