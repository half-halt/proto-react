import { useService } from "@hhf/services";
import { useEffect } from "preact/hooks";
import { ActionInfo, HeaderService } from "./Header";

export function useHeader(title?: string, actions: ActionInfo[] = []) {
	const headerService = useService(HeaderService);
	
	useEffect(() => {
		headerService.setTitle(title);
		headerService.setActions(actions);
	}, [title, actions]);
}