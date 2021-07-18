import { FC, StrictMode } from 'react';
import { render } from 'react-dom';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import '../reset.css';
import { AdminApp } from './src/AdminApp';
import { registerStartup, Services } from '@hhf/services';
import { DefaultTheme, ThemeService } from '@hhf/theme';

registerStartup(ThemeService).setAvailableThemes([DefaultTheme]);

const Root: FC = () => {
	return (
		<StrictMode>
			<RecoilRoot>
				<BrowserRouter>
					<Services>
						<AdminApp/>
					</Services>
				</BrowserRouter>
			</RecoilRoot>
		</StrictMode>
	);	
}

let renderTarget = document.createElement('div');
renderTarget.id = 'root';
document.body.appendChild(renderTarget);

render(<Root/>, renderTarget);