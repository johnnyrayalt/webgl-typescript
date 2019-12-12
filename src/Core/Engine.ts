import constants from '~/Assets/constants';
import { InputReferences } from '~/Core//Utilities/InputReferences';
import { GLBuffer } from '~/Core/GL/GLBuffer';
import { gl, GLCanvas } from '~/Core/GL/GLCanvas';
import { GLShader } from '~/Core/GL/GLShaders';
import { IAttributeHashMap } from '~/Interfaces/GL/IAttributeHashMap';
import { IUniformHashMap } from '~/Interfaces/GL/IUniformHashMap';
import { TriangleData } from './Shapes/Triangle';

/**
 * Main rendering engine class
 */
export class Engine {
	public canvas: HTMLCanvasElement;

	private inputReferences: InputReferences;
	private attributeIndex: IAttributeHashMap;
	private uniformIndex: IUniformHashMap;

	private shader: GLShader;
	private buffer: GLBuffer;

	public vertexSource: string;
	public fragmentSource: string;

	/**
	 *
	 * @param {InputReferences} inputReferences | HTML bindings from UI creation for realtime updates
	 * @param {GLCanvas} canvas | An HTMLCanvasElement bound to WebGL Context
	 * @param {GLShader} shader | WebGLProgram in use
	 * @param {GLBuffer} buffer | WebGLBuffer in use
	 */
	constructor(
		inputReferences: InputReferences,
		canvas: HTMLCanvasElement,
		shader: GLShader,
		buffer: GLBuffer,
		vertexSource: string,
		fragmentSource: string,
	) {
		this.inputReferences = inputReferences;
		this.canvas = canvas;
		this.shader = shader;
		this.buffer = buffer;

		this.vertexSource = vertexSource;
		this.fragmentSource = fragmentSource;
	}

	/**
	 * Start the Engine main loop
	 */
	public start = (): void => {
		/**
		 * Set default background of the canvas to black;
		 */
		gl.clearColor(1, 1, 1, 1);

		/**
		 * Uses shader program
		 */
		this.shader.use();

		/**
		 * Gets Attributes from shaders
		 */
		this.attributeIndex = {
			...this.shader.getAttributes(this.vertexSource, 6, TriangleData),
			...this.shader.getAttributes(this.fragmentSource, 3, TriangleData),
		};

		/**
		 * Gets Uniforms from shaders
		 */
		this.uniformIndex = {
			...this.shader.getUniforms(),
		};

		/**
		 * Binds attributes to buffer
		 */
		this.buffer.createBufferInfo(this.attributeIndex);

		/**
		 * Binds shader values
		 */
		this.buffer.bindAttributes();

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
		gl.uniform2f(this.uniformIndex[constants.shaders.uniforms.resolution], this.canvas.width, this.canvas.height);

		/**
		 * Updates Color & Slider UI values
		 */
		gl.uniform4f(
			this.uniformIndex[constants.shaders.uniforms.color],
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
