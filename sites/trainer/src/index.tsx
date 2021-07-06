import { render } from 'preact';
import { Application } from './Application';

let renderTarget = document.getElementById('root');
if (!renderTarget) {
	renderTarget = document.createElement('div');
	renderTarget.id = 'root';
	document.body.appendChild(renderTarget);
}

render(<Application/>, renderTarget);
