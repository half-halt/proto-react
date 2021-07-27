import { useObservable } from "@hhf/rx";
import { useService } from "@hhf/services";
import { Client } from "faunadb";
import { useRef } from "react";
import { AuthenticationService } from "./AuthenticationService";

export function useFaunaClient() {
	const client = useRef<Client|null>(null);
	const authService = useService(AuthenticationService);
	const user = useObservable(authService.user);

	if (!client.current && user) {
		client.current = new Client({ secret: user.token });
	} else if (client.current && !user) {
		client.current = null;
	}

	return client.current;
}