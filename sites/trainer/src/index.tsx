import { FunctionalComponent, render } from 'preact';
import { Services, registerStartup } from "@hhf/services";
import { DefaultTheme, ThemeService } from '@hhf/theme';
import { Application } from './Application';
import '../../reset.css';

registerStartup(ThemeService).setAvailableThemes([DefaultTheme]);

let renderTarget = document.getElementById('root');
if (!renderTarget) {
	renderTarget = document.createElement('div');
	renderTarget.id = 'root';
	document.body.appendChild(renderTarget);
}

/**
 * Renders the root of the application
 */
const Root: FunctionalComponent = () => {
	return (
		<Services fallback={<div>Loading...</div>}>
			<Application/>
		</Services>
	)
}

render(<Root/>, renderTarget);
