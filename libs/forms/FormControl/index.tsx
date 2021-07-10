import { nanoid } from "nanoid";
import { cloneElement, FunctionComponent, isValidElement, Children, PropsWithChildren } from "react";
import { useState } from "react";
import { FormControlProps } from "./props";

function isNonEmptyString(value: any): value is string {
	if ((typeof(value) === 'string') && (value.trim().length !== 0)) {
		return true;
	}
	return false;
}

export const FormControl: React.FC<PropsWithChildren<FormControlProps>> = ({
	help,
	errors,
	label,
	children
}) => {
	const [id] = useState(nanoid(5));

	return (
		<div className='hhf-formControl'>
			{isNonEmptyString(label) &&
				<label className="label" htmlFor={id}>{label}</label>
			}
			{Children.map(children, child => isValidElement(child) ?
				cloneElement(child, {id}) :
				child)
			}
			{Array.isArray(errors) && (errors.length !== 0) && 
				<label htmlFor={id} className="errors">
					{errors.map(error => <p>{error}</p>)}
				</label>
			}
			{isNonEmptyString(errors) && 
				<label htmlFor={id} className="errors">
					<p>{errors}</p>
				</label>
			}
			{isNonEmptyString(help) && !Array.isArray(errors) && !isNonEmptyString(errors) &&
				<label htmlFor={id} className="help">{help}</label>
			}
		</div>
	)
}