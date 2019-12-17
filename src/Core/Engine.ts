import { Canvas } from '~/Core/Utilities/HTMLElements/Canvas';
import { InputReferences } from '~/Core/Utilities/HTMLElements/InputReferences';
import { IAttributeManager } from '~/Interfaces/GL/IAttributeManager';
import { IBufferManager } from '~/Interfaces/GL/IBufferManager';
import { IUniformManager } from '~/Interfaces/GL/IUniformManager';
import { IObjectProperties } from '~/Interfaces/IObjectProperties';

export class Engine {
	private gl: WebGLRenderingContext;
	private shaderProgram: WebGLProgram;
	private attributeManager: IAttributeManager;
	private uniformManager: IUniformManager;
	private bufferManager: IBufferManager;
	private inputReferences: InputReferences;
	private objectProperties: IObjectProperties;

	constructor(
		gl: WebGLRenderingContext,
		shaderProgram: WebGLProgram,
		attributeManager: IAttributeManager,
		uniformManager: IUniformManager,
		bufferManager: IBufferManager,
		inputReferences: InputReferences,
		objectProperties: IObjectProperties,
	) {
		this.gl = gl;
		this.shaderProgram = shaderProgram;
		this.attributeManager = attributeManager;
		this.uniformManager = uniformManager;
		this.bufferManager = bufferManager;
		this.inputReferences = inputReferences;
		this.objectProperties = objectProperties;
	}

	public start = (): void => {
		/**
		 * Set canvas size to client size
		 */
		Canvas.resize(this.gl);
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

		/**
		 * Clear the canvas
		 */
		this.gl.clearColor(0, 0, 0, 0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		/**
		 * Use program
		 */
		this.gl.useProgram(this.shaderProgram);

		/**
		 * Extracts data from buffer and supplies it to attributes specified
		 */
		this.gl.enableVertexAttribArray(this.attributeManager.positionAttributeLocation);

		/**
		 * Rebinds the attributes to buffer with new context
		 */
		Object.keys(this.bufferManager).forEach(key => {
			this.bufferManager[key].bindBuffer(this.gl);
		});

		/**
		 * Tell attribute how to extract data from positionBuffer
		 */
		const size: number = 2; // number of components per iteration
		const type = this.gl.FLOAT; // data in 32bit floats
		const normalize = false; // Do not normalize the data
		const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
		const offset = 0; // Start at the begining of the buffer

		this.gl.vertexAttribPointer(this.attributeManager.positionAttributeLocation, size, type, normalize, stride, offset);

		/**
		 * Set the resolution
		 */
		this.gl.uniform2f(this.uniformManager.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

		/**
		 * Updates Color & Slider UI values
		 */
		this.gl.uniform4f(
			this.uniformManager.colorUniformLocation,
			this.inputReferences.uiValues.r,
			this.inputReferences.uiValues.g,
			this.inputReferences.uiValues.b,
			this.inputReferences.uiValues.w,
		);
		this.inputReferences.setDOMSliderValues();
		this.gl.uniform2fv(this.uniformManager.translationUniformLocation, this.objectProperties.translation);
		const updatePosition = () => {
			if (
				this.objectProperties.translation[0] !== this.inputReferences.uiValues.x ||
				this.objectProperties.translation[1] !== this.inputReferences.uiValues.y
			) {
				this.objectProperties.translation[0] = this.inputReferences.uiValues.x;
				this.objectProperties.translation[1] = this.inputReferences.uiValues.y;
			}
		};
		updatePosition();
		/**
		 * Draws image as triangles
		 */
		const primitiveType = this.gl.TRIANGLES;
		const count = 18;
		this.gl.drawArrays(primitiveType, offset, count);
		requestAnimationFrame(this.start.bind(this));
	};
}
