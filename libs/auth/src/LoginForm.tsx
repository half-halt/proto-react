import { FC } from "react";
import { FormControl } from "@hhf/forms"

export const LoginForm:  FC = () => {
	return (
		<form>
			<header>
				<h2>HHF Administation</h2>
			</header>
			
			<FormControl label="Email:">
				<input type="text" name="email" placeholder="< Enter Email >" />
			</FormControl>
			<FormControl label="Password:">
				<input type="password" name="password" placeholder="< Enter Password >" />
			</FormControl>
			<div>
				<button className="primary">Login</button>
			</div>
		</form>
	);
}