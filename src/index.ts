import { Engine } from './Core/Engine';

const engine = new Engine();

window.onload = () => {
	engine.start();
};

window.onresize = () => {
	engine.resize();
};
