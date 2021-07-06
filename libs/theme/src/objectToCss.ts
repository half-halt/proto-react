
function createCssValue(value: unknown) {
	if (typeof value === "function") {
		value = value.call(null);
	}

	if (typeof value === "number") {
		value = value.toString().concat("em");
	} else if (Array.isArray(value)) {
		const arrayValues = value.map(v => createCssValue(v));
		value = arrayValues.join(' ');
	}

	return String(value);
}

function createVariableName(name: string, parent: string) {
	if (name === '.') {
		return parent;
	}

	return parent.concat('-', name.toLowerCase());
}

function objectToCssVariables(object: Record<string, unknown>, parent: string, vars: Record<string, string>) {
	for (const [name, value] of Object.entries(object)) {
		if (!value) {
			continue;
		}

		if (typeof value === "object") {
			objectToCssVariables(value as Record<string, unknown>, parent.concat('-', name.toLowerCase()), vars);
		} else {
			const varName = createVariableName(name, parent);
			if (vars[varName]) {
				throw new Error(`Duplicate theme variable name "${varName}"`);
			}

			vars[varName] = createCssValue(value);
		}
	}

	console.dir(vars);
}
  
export function objectToCss(object: Record<string, unknown>, parent: string) {
	const css: string[] = [];
	const vars: Record<string, string> = {};
	objectToCssVariables(object, parent, vars);

	for (const [name, value] of Object.entries(vars)) {
		css.push(name.concat(': ', value));
	}

	return css.join(';\r\n');
}
  