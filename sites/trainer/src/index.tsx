import { FunctionComponent } from 'react';
import { Services, registerStartup } from "@hhf/services";
import { DefaultTheme, ThemeService } from '@hhf/theme';
import { Application } from './Application';
import { render } from 'react-dom';
import '../../reset.css';
import { RecoilRoot } from 'recoil';

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
const Root: FunctionComponent = () => {
	return (
		<Services fallback={<div>Loading...</div>}>
			<RecoilRoot>
				<Application/>
			</RecoilRoot>
		</Services>
	)
}

render(<Root/>, renderTarget);
