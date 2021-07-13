import { HorsesClient } from "@hhf/api";
import { getService } from "@hhf/services";
import { rejects } from "node:assert";
import { cloneElement, createElement, ReactElement } from "react";
import { ComponentType, FunctionComponent, useEffect, useRef, useState } from "react";
import { Params } from "react-router";
import { Routes, Route, useMatch, useResolvedPath, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { EMPTY, forkJoin, merge, Observable, tap } from "rxjs";
import { useHeader } from "../../components/header/useHeader";
import { CreateHorse } from "./components/CreateHorse";
import { ViewHorses } from "./components/ViewHorses";
import { horseState } from "../../states/horses";
import './horses.scss';

const ViewHorse: FunctionComponent = () => {
	useHeader('Horse')

	const params = useParams();
	const horse = useRecoilValue(horseState(params.horseId));

	return (
		<div>
			<div>id: {horse.id}</div>
			<div>name: {horse.name}</div>
			<div>nickname: {horse.nickname}</div>
		</div>
	)
}

/*
function usePromise() {
	const resolveRef = useRef({
		resolve: (value: any) => {},
		reject: (error: Error) => {}
	});
	const promiseRef = useRef(new Promise(
		(resolve, reject) => {
			resolveRef.current.resolve = resolve;
			resolveRef.current.reject = reject;
		}
	));

	return {
		promise: promiseRef.current,
		resolvePromise: resolveRef.current.resolve, 
		rejectPromise: resolveRef.current.reject 
	};
}

function withResolvers(component: any, resolve: Record<string, (params: Params) => Observable<any>>) {
	const hoc = (props: any) => {
		console.log("--> withResolvers", component, props);
		const resolveRef = useRef<Record<string, any>>({});
		const routeParams = useParams();
		const [resolved, setResolved] = useState(false);
		const  { promise, resolvePromise, rejectPromise } = usePromise();

		useEffect(() => {
			console.log("--> useEffect");
			const watch: Observable<any>[] = [];
			for (const [key, handler] of Object.entries(resolve)) {
				const observable = handler.call(null, routeParams);
				if (observable instanceof Observable) {
					watch.push(observable.pipe(
						tap(result => resolveRef.current[key] = result)
					));
				}
			}

			const subscription = forkJoin(watch).subscribe({
				next: (result) => { 
					console.log("result", result);
					setResolved(true), 
					resolvePromise(result) 
				},
				error: (error) => rejectPromise(error)
			});

			return () => {
				subscription.unsubscribe();
			};
		}, []);

		if (resolved) {
			return createElement(component, { ...props, ...resolveRef.current });
		}

		return null;
	}

	hoc.displayName = `withResolvers(${component.name})`;
	return hoc;
}

const horsesApi = getService(HorsesClient);

const ViewHorse = withResolvers(rawViewHorse, {
	horse: (params: Params) => {
		console.log('params:', params);
		if (typeof(params.horseId) === 'string') {
			return horsesApi.getHorse(params.horseId);
		}

		return EMPTY;
	}
})
*/

export const Horses: FunctionComponent = (props: any) => {
	console.log('props', props);
	return (
		<Routes>
			<Route path="create" element={<CreateHorse/>}/>
			<Route path="/" element={<ViewHorses/>}/>
			<Route path=":horseId" element={<ViewHorse/>}/>
		</Routes>
	)
}