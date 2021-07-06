import { Header } from "./header"
import "./app.css"
import "./other.scss";
import { Navigation } from "@hhf/ui";
import { Themed } from "@hhf/theme";


export function Application() {
	return (
		<Themed>
			<Header text="My Header" />
			<Navigation />
			<div class="stuff">some text</div>
			<div class="other2">some text again</div>
		</Themed>
	)	
}