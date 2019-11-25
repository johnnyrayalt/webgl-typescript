import { gl, GLCanvas } from './GL/GLCanvas';
import { Shader } from './Shaders/Shaders';
import { GLBuffer } from './GL/GLBuffer';
import { ConvertRbgToXyz } from './Services/ConvertRBGToXYZ';
import { IAttributeInfo } from '../Interfaces/IAttributeInfo';
import { GLSLWrapper } from './Utilities/GLSLWrapper';

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
		this.loadShaders();
		this.shader.use();

		this.createBuffer();

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

	private createBuffer = (): void => {
		this.buffer = new GLBuffer(3);

		const positionAttribute = {} as IAttributeInfo;
		positionAttribute.location = this.shader.getAttributeLocation('a_position');
		positionAttribute.offset = 0;
		positionAttribute.size = 3;
		this.buffer.addAttributeLocation(positionAttribute);
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

		this.buffer.pushBackData(vertices);
		this.buffer.upload();
		this.buffer.unbind();
	};

	private loadShaders = (): void => {
		const loadVertexShaderInput = GLSLWrapper.getShaderType('vertexShader');
		const loadFragmentShaderInput = GLSLWrapper.getShaderType('fragmentShader');
		const convertShaders = GLSLWrapper.convertFilesToString([loadVertexShaderInput, loadFragmentShaderInput]);
		const verticalShaderSource: string = convertShaders[0];
		const fragmentShaderSource: string = convertShaders[1];

		this.shader = new Shader('basic', verticalShaderSource, fragmentShaderSource);
	};
}
