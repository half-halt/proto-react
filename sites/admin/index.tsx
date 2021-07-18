import { FC, StrictMode } from 'react';
import { render } from 'react-dom';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import '../reset.css';
import { AdminApp } from './src/AdminApp';

const Root: FC = () => {
	return (
		<StrictMode>
			<RecoilRoot>
				<BrowserRouter>
					<AdminApp/>
				</BrowserRouter>
			</RecoilRoot>
		</StrictMode>
	);	
}

let renderTarget = document.createElement('div');
renderTarget.id = 'root';
document.body.appendChild(renderTarget);

render(<Root/>, renderTarget);