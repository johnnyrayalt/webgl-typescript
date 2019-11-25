import { GLBuffer } from './GL/GLBuffer';
import { gl, GLCanvas } from './GL/GLCanvas';
import { ConvertRbgToXyz } from './Services/ConvertRBGToXYZ';
import { Shader } from './Shaders/Shaders';

/**
 * Main rendering engine class
 */
export class Engine {
	public canvas: HTMLCanvasElement;
	private shader: Shader;
	private buffer: GLBuffer;

	/**
	 * Start the Engine main loop
	 */
	public start = (): void => {
		this.canvas = GLCanvas.initialize();
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		const loadShaders = Shader.setShaders();
		this.shader = new Shader('basic', loadShaders[0], loadShaders[1]);
		this.shader.use();

		this.buffer = new GLBuffer(3);
		this.buffer.createBuffer(this.shader);

		this.loop();
	};

	/**
	 * Main loop that is called 60 times a second
	 */
	private loop = (): void => {
		/**
		 * Clears canvas for new draw
		 */
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		/**
		 * Rerender canvas if resized
		 */
		GLCanvas.checkRender(this.canvas, this.buffer);

		/**
		 * Sets viewport, i.e. where in clipspace the object is rendered
		 */
		gl.viewport(0, 0, this.canvas.width, this.canvas.height);

		/**
		 * Sets uniforms from shaders
		 */
		const colorPosition = this.shader.getUniformLocation('u_color');
		const colorValues = ConvertRbgToXyz.extractRBGValues();
		gl.uniform4f(colorPosition, colorValues[0], colorValues[1], colorValues[2], colorValues[3]);

		/**
		 * Binds shader values
		 */
		this.buffer.bind();


		requestAnimationFrame(this.loop.bind(this));
	};
}
