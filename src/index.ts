import { Engine } from './Core/Engine';
const engine = new Engine();
require('./Assets/IndexStyles.css');

engine.bootStrapUI();

window.onload = () => {
	engine.start();
};
