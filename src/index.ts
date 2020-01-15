import { GLCanvas } from '~/Core/GLComponents/GLCanvas';

((): void => {
	const canvas = new GLCanvas();
	const gl = canvas.getGLContext();
	canvas.clearColor([0, 0, 0, 1]);
})();
