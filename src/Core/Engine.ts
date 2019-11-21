import { gl, GLUtilities } from './gl/GLUtilities';
import { Shader } from './shaders/Shaders';
import { AttributeInfo, GLBuffer } from './gl/GLBuffer';

/**
 * Main game engine class
 */
export class Engine {
	private _canvas: HTMLCanvasElement;
	private _shader: Shader;
	private _buffer: GLBuffer;

	public constructor() {}

	/**
	 * Start the Engine main game loop
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
		gl.uniform4f(colorPosition, 1, 0.5, 0, 1);

		this._buffer.bind();
		this._buffer.draw();

		requestAnimationFrame(this.loop.bind(this));
	};

	private createBuffer = (): void => {
		this._buffer = new GLBuffer(3);

		const positionAttribute = new AttributeInfo();
		positionAttribute.location = this._shader.getAttributeLocation('a_position');
		positionAttribute.offset = 0;
		positionAttribute.size = 3;
		this._buffer.addAttributeLocation(positionAttribute);
		// triangle
		// prettier-ignore
		const vertices = [
			0,    0,     0, // x
			0,    0.5,   0, // y
			0.5,  0.5,   0  // z
		];

		this._buffer.pushBackData(vertices);
		this._buffer.upload();
		this._buffer.unbind();
	};

	private loadShaders = (): void => {
		const verticalShaderSource: string = `
attribute vec3 a_position;

void main() {
    gl_Position = vec4(a_position, 1.0);
}`;

		const fragmentShaderSource: string = `
precision mediump float;
uniform vec4 u_color;

void main() {
    gl_FragColor = u_color;
}`;

		this._shader = new Shader('basic', verticalShaderSource, fragmentShaderSource);
	};
}
