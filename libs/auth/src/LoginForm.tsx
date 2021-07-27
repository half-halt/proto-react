import { FC, FormEventHandler } from "react";
import { FormControl, useForm } from "@hhf/forms"
import { useService } from "@hhf/services";
import { AuthenticationService } from './AuthenticationService';

export const LoginForm:  FC = () => {
	const { register, validate, errors } = useForm<{ email: string, password: string }>({});
	const authService = useService(AuthenticationService);

	const handleSubmit: FormEventHandler  = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const { valid, value } = validate();
		if (valid) {
			authService.login(value.email, value.password).then(
				(u) => console.log(u)
			)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<header>
				HHF Admin
			</header>
			
			<FormControl label="Email:" errors={errors.email}>
				<input ref={register} type="text" name="email" placeholder="< Enter Email >" />
			</FormControl>
			<FormControl label="Password:" errors={errors.password}>
				<input ref={register} type="password" name="password" placeholder="< Enter Password >" />
			</FormControl>

			<div className='actions'>
				<button className="primary">Login</button>
			</div>
		</form>
	);
}