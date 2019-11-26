import { Engine } from './Core/Engine';
const engine = new Engine();
require('./IndexStyles.css');
engine.bootStrapUI();

window.onload = () => {
	engine.start();
};
