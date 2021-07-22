import { FC, FormEventHandler } from "react";
import { FormControl, useForm } from "@hhf/forms"

export const LoginForm:  FC = () => {
	const { register, validate, errors } = useForm({});

	const handleSubmit: FormEventHandler  = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const { valid, value } = validate();
		if (valid) {
			console.log("--> valid", value);
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