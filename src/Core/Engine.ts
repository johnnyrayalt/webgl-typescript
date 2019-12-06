import { GLBuffer } from './GL/GLBuffer';
import { gl, GLCanvas } from './GL/GLCanvas';
import { GLShader } from './GL/GLShaders';
import { InputReferences } from './Services/InputReferences';

/**
 * Main rendering engine class
 */
export class Engine {
	public canvas: HTMLCanvasElement;
	private shader: GLShader;
	private buffer: GLBuffer;
	private uniformLocationIndex: { [name: string]: WebGLUniformLocation };
	private inputReferences: InputReferences;

	constructor(inputReferences: InputReferences) {
		this.inputReferences = inputReferences;
	}

	/**
	 * Start the Engine main loop
	 */
	public start = (): void => {
		/**
		 * Initialize new Canvas then set default background to black;
		 */
		this.canvas = GLCanvas.initialize();
		gl.clearColor(0.0, 0.0, 0.0, 1);

		/**
		 * Creates and attaches shaders
		 */
		const loadShaders = GLShader.setShaders();
		this.shader = new GLShader('basic', loadShaders[0], loadShaders[1]);
		this.shader.use();

		/**
		 * Gets uniforms from shaders
		 */
		this.uniformLocationIndex = {
			colorUniformLocation: this.shader.getUniformLocation('u_color'),
		};

		/**
		 * Creates and binds data to buffer
		 */
		this.buffer = new GLBuffer(3);
		this.buffer.createBuffer(this.shader);
		/**
		 * Binds shader values
		 */
		this.buffer.bind();

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
		this.shader.use;

		/**
		 * Sets viewport, i.e. where in clipspace the object is rendered
		 */
		gl.viewport(0, 0, this.canvas.width, this.canvas.height);

		/**
		 * Updates UI values
		 */
		gl.uniform4f(
			this.uniformLocationIndex.colorUniformLocation,
			this.inputReferences.rgbw.r,
			this.inputReferences.rgbw.g,
			this.inputReferences.rgbw.b,
			this.inputReferences.rgbw.w,
		);
		this.inputReferences.setDOMSliderValues();

		/**
		 * Redraw 60 times a second
		 */
		requestAnimationFrame(this.loop.bind(this));
	};
}
