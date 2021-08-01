
export function getValue(element: HTMLElement): string | File {
	if (element.tagName === "TEXTAREA") {
		return (element as HTMLTextAreaElement).value.trim();
	} else if (element.tagName === "INPUT") {
		const inputEl = (element as HTMLInputElement);
		if (inputEl.type !== "file") {
			return inputEl.value.trim();
		} else {
			return (inputEl.files?.item(0) ?? "");
		}
	}

	return "";
}