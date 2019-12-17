import { InputReferences } from './Core/Utilities/InputReferences';
import { GLCanvas } from '~/Core/GLComponents/GLCanvas';
// @ts-ignore
import BasicFragmentShader from '~/Core/Shaders/FragmentShaders/BasicFragmentShader.frag';
// @ts-ignore
import BasicVertexShader from '~/Core/Shaders/VertexShaders/BasicVertexShader.vert';
import { CreateUI } from '~/Core/Utilities/CreateUI';
require('./Assets/IndexStyles.css');

const shaderManager: { [name: string]: string } = {};

const getShaderSources = (): any => {
	shaderManager.vertexShaderSource = BasicVertexShader;
	shaderManager.fragmentShaderSource = BasicFragmentShader;
};

const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const error = gl.getShaderInfoLog(shader);
	if (error !== '') {
		gl.deleteShader(shader);
		throw new Error(`Error compiling shader from source: ${source}: ${error}`);
	}

	return shader;
};

const createProgram = (
	gl: WebGLRenderingContext,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader,
): WebGLProgram => {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	const error = gl.getProgramInfoLog(program);
	if (error !== '') {
		gl.deleteProgram(program);
		throw new Error(`Error linking shaders into program: ${error}`);
	}

	return program;
};

const resize = (gl: WebGLRenderingContext): void => {
	const convertToCSSPixels: number = window.devicePixelRatio;
	const client: HTMLCanvasElement = gl.canvas as HTMLCanvasElement;
	const displayWidth: number = Math.floor(client.clientWidth * convertToCSSPixels);
	const displayHeight: number = Math.floor(client.clientHeight * convertToCSSPixels);

	if (client.width !== displayWidth || client.height !== displayHeight) {
		client.width = displayWidth;
		client.height = displayHeight;
	}
};

const setRectangle = (gl: WebGLRenderingContext, x: number, y: number, width: number, height: number): void => {
	const x1 = x;
	const x2 = x + width;
	const y1 = y;
	const y2 = y + height;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);
};

((): void => {
	/**
	 * Create canvas as HTMLCanvasElement and attach WebGLRenderingContext
	 */
	const canvasCtx: HTMLCanvasElement = CreateUI.createHTMLCanvas();
	const glCanvas = new GLCanvas(canvasCtx);

	/**
	 * Create UI Elements
	 */
	CreateUI.bootStrapUI();

	/**
	 * Bind UI References
	 */
	const inputReferences = new InputReferences();

	/**
	 * Gets and Creates Shaders
	 */
	getShaderSources();
	const vertexShader = createShader(glCanvas.gl, glCanvas.gl.VERTEX_SHADER, shaderManager.vertexShaderSource);
	const fragmentShader = createShader(glCanvas.gl, glCanvas.gl.FRAGMENT_SHADER, shaderManager.fragmentShaderSource);

	/**
	 * Creates WebGLProgram from shaders
	 */
	const shaderProgram = createProgram(glCanvas.gl, vertexShader, fragmentShader);

	/**
	 * get Attributes and Uniforms
	 */
	const positionAttributeLocation = glCanvas.gl.getAttribLocation(shaderProgram, 'a_position');
	const resolutionUniformLocation = glCanvas.gl.getUniformLocation(shaderProgram, 'u_resolution');
	const colorUniformLocation = glCanvas.gl.getUniformLocation(shaderProgram, 'u_color');

	/**
	 * Create buffers for attributes to recieve data
	 */
	const positionBuffer = glCanvas.gl.createBuffer();

	/**
	 * Bind buffers
	 */
	glCanvas.gl.bindBuffer(glCanvas.gl.ARRAY_BUFFER, positionBuffer);

	const translation = [0, 0];
	const width = 100;
	const height = 30;

	/**
	 * BEGIN RENDER LOGIC
	 */

	const drawScene = (): void => {
		/**
		 * Set canvas size to client size
		 */
		resize(glCanvas.gl);
		glCanvas.gl.viewport(0, 0, glCanvas.gl.canvas.width, glCanvas.gl.canvas.height);

		/**
		 * Clear the canvas
		 */
		glCanvas.gl.clearColor(0, 0, 0, 0);
		glCanvas.gl.clear(glCanvas.gl.COLOR_BUFFER_BIT);

		/**
		 * Use program
		 */
		glCanvas.gl.useProgram(shaderProgram);

		/**
		 * Extracts data from buffer and supplies it to attributes specified
		 */
		glCanvas.gl.enableVertexAttribArray(positionAttributeLocation);

		/**
		 * Rebinds the attributes to buffer with new context
		 */
		glCanvas.gl.bindBuffer(glCanvas.gl.ARRAY_BUFFER, positionBuffer);

		setRectangle(glCanvas.gl, translation[0], translation[1], width, height);

		/**
		 * Tell attribute how to extract data from positionBuffer
		 */
		const size: number = 2; // number of components per iteration
		const type = glCanvas.gl.FLOAT; // data in 32bit floats
		const normalize = false; // Do not normalize the data
		const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
		const offset = 0; // Start at the begining of the buffer

		glCanvas.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

		/**
		 * Set the resolution
		 */
		glCanvas.gl.uniform2f(resolutionUniformLocation, glCanvas.gl.canvas.width, glCanvas.gl.canvas.height);

		/**
		 * Updates Color & Slider UI values
		 */
		glCanvas.gl.uniform4f(
			colorUniformLocation,
			inputReferences.uiValues.r,
			inputReferences.uiValues.g,
			inputReferences.uiValues.b,
			inputReferences.uiValues.w,
		);
		inputReferences.setDOMSliderValues();
		const updatePosition = () => {
			if (translation[0] !== inputReferences.uiValues.x || translation[1] !== inputReferences.uiValues.y) {
				translation[0] = inputReferences.uiValues.x;
				translation[1] = inputReferences.uiValues.y;
			}
		};
		updatePosition();
		/**
		 * Draws image as triangles
		 */
		const primitiveType = glCanvas.gl.TRIANGLES;
		const count = 6;
		glCanvas.gl.drawArrays(primitiveType, offset, count);
		requestAnimationFrame(drawScene.bind(drawScene));
	};

	drawScene();
})();
