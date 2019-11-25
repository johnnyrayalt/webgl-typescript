import { Engine } from './Core/Engine';
import { GLCanvas } from './Core/GL/GLCanvas';

const engine = new Engine();

window.onload = () => {
	engine.start();
};

window.onresize = () => {
	GLCanvas.resize(engine.canvas);
};
