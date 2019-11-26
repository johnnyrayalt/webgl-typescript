import { Engine } from './Core/Engine';

const engine = new Engine();
engine.bootStrapUI();

window.onload = () => {
	engine.start();
};
