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
		this.gl.enableVertexAttribArray(this.attributeManager.a_position.index);

		/**
		 * Rebinds the attributes to buffer with new context
		 */
		Object.keys(this.bufferManager).forEach((key: string) => {
			this.bufferManager[key].bindBuffer(this.gl);
		});

		/**
		 * Tell attribute how to extract data from positionBuffer
		 */
		this.gl.vertexAttribPointer(
			this.attributeManager.a_position.index,
			this.attributeManager.a_position.size,
			this.attributeManager.a_position.type,
			this.attributeManager.a_position.normalize,
			this.attributeManager.a_position.stride,
			this.attributeManager.a_position.offset,
		);

		/**
		 * Set the resolution
		 */
		this.gl.uniform2f(this.uniformManager.u_resolution, this.gl.canvas.width, this.gl.canvas.height);

		/**
		 * Updates Color & Slider UI values
		 */
		this.gl.uniform4f(
			this.uniformManager.u_color,
			this.inputReferences.uiValues.colorR,
			this.inputReferences.uiValues.colorG,
			this.inputReferences.uiValues.colorB,
			this.inputReferences.uiValues.colorW,
		);
		this.inputReferences.setDOMSliderValues();

		/**
		 * Updates translation
		 */
		this.gl.uniform2fv(this.uniformManager.u_translation, this.objectProperties.translation);

		/**
		 * Updates rotation
		 */
		this.gl.uniform2fv(this.uniformManager.u_rotation, this.objectProperties.rotation);

		/**
		 * Updates scale
		 */
		this.gl.uniform2fv(this.uniformManager.u_scale, this.objectProperties.scale);

		/**
		 * Update DOM
		 */
		this.inputReferences.updateObject(
			this.objectProperties.translation,
			this.objectProperties.rotation,
			this.objectProperties.scale,
		);
		/**
		 * Draws image as triangles
		 */
		const primitiveType = this.gl.TRIANGLES;
		const count = 18;
		this.gl.drawArrays(primitiveType, this.attributeManager.a_position.offset, count);

		requestAnimationFrame(this.start.bind(this));
	};
}
