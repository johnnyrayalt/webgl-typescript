import { gl, GLUtilities } from './GL/GLUtilities';
import { Shader } from './Shaders/Shaders';
import { GLBuffer } from './GL/GLBuffer';
import { ConvertRbgToXyz } from './Services/ConvertRBGToXYZ';
import { IAttributeInfo } from '../Interfaces/IAttributeInfo';
import { GLSLWrapper } from './Utilities/GLSLWrapper';
import * as path from 'path';

/**
 * Main rendering engine class
 */
export class Engine {
	private _canvas: HTMLCanvasElement;
	private _shader: Shader;
	private _buffer: GLBuffer;

	/**
	 * Start the Engine main loop
	 */
	public start = (): void => {
		this._canvas = GLUtilities.initialize();
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.loadShaders();
		this._shader.use();

		this.createBuffer();

		this.resize();
		this.loop();
	};

	/**
	 * Resizes canvas to window size
	 */
	public resize = (): void => {
		if (this._canvas !== undefined) {
			this._canvas.width = window.innerWidth;
			this._canvas.height = window.innerHeight;

			gl.viewport(0, 0, this._canvas.width, this._canvas.height);
		}
	};

	private loop = (): void => {
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Set uniforms.
		const colorPosition = this._shader.getUniformLocation('u_color');
		const colorValues = ConvertRbgToXyz.extractRBGValues();
		gl.uniform4f(colorPosition, colorValues[0], colorValues[1], colorValues[2], colorValues[3]);

		this._buffer.bind();
		this._buffer.draw();

		requestAnimationFrame(this.loop.bind(this));
	};

	private createBuffer = (): void => {
		this._buffer = new GLBuffer(3);

		const positionAttribute = {} as IAttributeInfo;
		positionAttribute.location = this._shader.getAttributeLocation('a_position');
		positionAttribute.offset = 0;
		positionAttribute.size = 3;
		this._buffer.addAttributeLocation(positionAttribute);
		// triangle
		// prettier-ignore
		const vertices = [
			// top triangle
			0,    0,    0, // x
			0,    0.5,  0, // y
			0.5,  0.5,  0, // z

			// bottom triangle
			0.5,  0.5,  0,
			0.5,  0,    0,
			0,    0,    0,
		];

		this._buffer.pushBackData(vertices);
		this._buffer.upload();
		this._buffer.unbind();
	};

	private loadShaders = (): void => {
		const loadVertexShaderInput = GLSLWrapper.getShaderType('vertexShader');
		const loadFragmentShaderInput = GLSLWrapper.getShaderType('fragmentShader');
		const convertShaders = GLSLWrapper.convertFilesToString([loadVertexShaderInput, loadFragmentShaderInput]);
		const verticalShaderSource: string = convertShaders[0];
		const fragmentShaderSource: string = convertShaders[1];

		this._shader = new Shader('basic', verticalShaderSource, fragmentShaderSource);
	};
}
