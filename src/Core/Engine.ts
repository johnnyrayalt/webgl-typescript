import { GLBuffer } from './GL/GLBuffer';
import { gl, GLCanvas } from './GL/GLCanvas';
import { GLShader } from './GL/GLShaders';
import { ConvertRbgToXyz } from './Services/ConvertRBGToXYZ';
import { CreateUI } from './Services/CreateUI';

/**
 * Main rendering engine class
 */
export class Engine {
	public canvas: HTMLCanvasElement;
	private shader: GLShader;
	private buffer: GLBuffer;


	public bootStrapUI = (): void => {
		CreateUI.generateSlider("r", {elementType: "range", min: 0, step: 1, max: 100, value: 50});
		CreateUI.generateSlider("g", {elementType: "range", min: 0, step: 1, max: 100, value: 50});
		CreateUI.generateSlider("b", {elementType: "range", min: 0, step: 1, max: 100, value: 50});
		CreateUI.generateSlider("w", {elementType: "range", min: 0, step: 1, max: 100, value: 100});
	};

	/**
	 * Start the Engine main loop
	 */
	public start = (): void => {
		/**
		 * Initialize new Canvas then set default background to black;
		 */
		this.canvas = GLCanvas.initialize();
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		/**
		 * Creates and attaches shaders
		 */
		const loadShaders = GLShader.setShaders();
		this.shader = new GLShader('basic', loadShaders[0], loadShaders[1]);
		this.shader.use();

		/**
		 * Creates and binds data to buffer
		 */
		this.buffer = new GLBuffer(3);
		this.buffer.createBuffer(this.shader);

		/**
		 * Start main loop
		 */
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
		 * Gets uniforms from shaders
		 */
		const colorPosition = this.shader.getUniformLocation('u_color');

		/**
		 * Updates UI values
		 */
		const colorValues = ConvertRbgToXyz.extractRBGValues();
		CreateUI.updateSliderValue(colorValues);
		/**
		 * Sets uniforms
		 */
		gl.uniform4f(colorPosition, colorValues[0], colorValues[1], colorValues[2], colorValues[3]);

		/**
		 * Binds shader values
		 */
		this.buffer.bind();

		/**
		 * Redraw 60 times a second
		 */
		requestAnimationFrame(this.loop.bind(this));
	};
}
