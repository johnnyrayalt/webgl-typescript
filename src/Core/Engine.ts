import constants from '~/Assets/constants';
import { InputReferences } from '~/Core//Utilities/InputReferences';
import { GLBuffer } from '~/Core/GL/GLBuffer';
import { gl, GLCanvas } from '~/Core/GL/GLCanvas';
import { GLShader } from '~/Core/GL/GLShaders';
import { IUniformHashMap } from '~/Interfaces/GL/IUniformHashMap';
import { INumHashMap } from '~/Interfaces/INumHashMap';

/**
 * Main rendering engine class
 */
export class Engine {
	public canvas: HTMLCanvasElement;

	private inputReferences: InputReferences;
	private attributeLocationIndex: INumHashMap;
	private uniformLocationIndex: IUniformHashMap;

	private shader: GLShader;
	private buffer: GLBuffer;

	/**
	 *
	 * @param {InputReferences} inputReferences | HTML bindings from UI creation for realtime updates
	 * @param {GLCanvas} canvas | An HTMLCanvasElement bound to WebGL Context
	 * @param {GLShader} shader | WebGLProgram in use
	 * @param {GLBuffer} buffer | WebGLBuffer in use
	 */
	constructor(inputReferences: InputReferences, canvas: HTMLCanvasElement, shader: GLShader, buffer: GLBuffer) {
		this.inputReferences = inputReferences;
		this.canvas = canvas;
		this.shader = shader;
		this.buffer = buffer;
	}

	/**
	 * Start the Engine main loop
	 */
	public start = (): void => {
		/**
		 * Set default background of the canvas to black;
		 */
		gl.clearColor(0.0, 0.0, 0.0, 1);

		/**
		 * Uses shader program
		 */
		this.shader.use();

		/**
		 * Gets Attributes from shaders
		 */
		this.attributeLocationIndex = {
			positionAttributeLocation: this.shader.getAttributeLocation(constants.shaders.attributes.position),
		};
		/**
		 * Gets uniforms from shaders
		 */
		this.uniformLocationIndex = {
			colorUniformLocation: this.shader.getUniformLocation(constants.shaders.uniforms.color),
		};

		/**
		 * Binds data to buffer
		 */
		this.buffer.createBuffer(this.attributeLocationIndex.positionAttributeLocation);

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
		 * Updates Slider UI values
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
