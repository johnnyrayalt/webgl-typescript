import { Engine } from '~/Core/Engine';
import { LetterU } from '~/Core/Geometry/LetterU';
import { GLBuffer } from '~/Core/GLComponents/GLBuffer';
import { GLCanvas } from '~/Core/GLComponents/GLCanvas';
import { GLShader } from '~/Core/GLComponents/GLShader';
// @ts-ignore
import BasicFragmentShader from '~/Core/Shaders/FragmentShaders/BasicFragmentShader.frag';
// @ts-ignore
import BasicVertexShader from '~/Core/Shaders/VertexShaders/BasicVertexShader.vert';
import { Canvas } from '~/Core/Utilities/HTMLElements/Canvas';
import { InputReferences } from '~/Core/Utilities/HTMLElements/InputReferences';
import { Slider } from '~/Core/Utilities/HTMLElements/Slider';
import { IAttributeManager } from '~/Interfaces/GL/IAttributeManager';
import { IBufferManager } from '~/Interfaces/GL/IBufferManager';
import { IUniformManager } from '~/Interfaces/GL/IUniformManager';
import { IObjectProperties } from '~/Interfaces/IObjectProperties';
require('~/Assets/IndexStyles.css');

((): void => {
	/**
	 * Create canvas as HTMLCanvasElement and attach WebGLRenderingContext
	 */
	const canvasCtx: Canvas = new Canvas();
	const glCanvas: GLCanvas = new GLCanvas(canvasCtx.canvas);
	Canvas.resize(glCanvas.gl);

	/**
	 * Create UI Elements
	 */
	const objectProperties: IObjectProperties = {
		translation: [0, 0],
		width: 100,
		height: 30,
	};
	const sliderContainer: string = 'slider-container';

	new Slider('r', sliderContainer, { min: 0, max: 100, step: 1, value: 50 });
	new Slider('g', sliderContainer, { min: 0, max: 100, step: 1, value: 50 });
	new Slider('b', sliderContainer, { min: 0, max: 100, step: 1, value: 50 });
	new Slider('w', sliderContainer, { min: 0, max: 100, step: 1, value: 100 });

	new Slider('x', sliderContainer, {
		min: 0,
		max: glCanvas.gl.canvas.width - objectProperties.width,
		step: 1,
		value: 0,
	});
	new Slider('y', sliderContainer, {
		min: 0,
		max: glCanvas.gl.canvas.height - objectProperties.height,
		step: 1,
		value: 0,
	});

	/**
	 * Bind UI References
	 */
	const inputReferences = new InputReferences();

	/**
	 * Gets and Creates Shaders
	 */
	const vertexShader = new GLShader(glCanvas.gl, 'Basic', glCanvas.gl.VERTEX_SHADER, BasicVertexShader);
	const fragmentShader = new GLShader(glCanvas.gl, 'Basic', glCanvas.gl.FRAGMENT_SHADER, BasicFragmentShader);

	/**
	 * Creates WebGLProgram from shaders
	 */
	const shaderProgram: WebGLProgram = GLShader.createProgram(glCanvas.gl, vertexShader.shader, fragmentShader.shader);

	/**
	 * gets Attributes and Uniforms
	 */
	const attributeManager: IAttributeManager = {
		positionAttributeLocation: glCanvas.gl.getAttribLocation(shaderProgram, 'a_position'),
	};

	const uniformManager: IUniformManager = {
		resolutionUniformLocation: glCanvas.gl.getUniformLocation(shaderProgram, 'u_resolution'),
		colorUniformLocation: glCanvas.gl.getUniformLocation(shaderProgram, 'u_color'),
		translationUniformLocation: glCanvas.gl.getUniformLocation(shaderProgram, 'u_translation'),
	};

	/**
	 * Create buffers for attributes to recieve data
	 */
	const bufferManager: IBufferManager = {
		positionBuffer: new GLBuffer(glCanvas.gl),
	};

	/**
	 * Bind buffers
	 */
	Object.keys(bufferManager).forEach(key => {
		bufferManager[key].bindBuffer(glCanvas.gl);
	});

	GLBuffer.setGeometry(glCanvas.gl, LetterU);

	/**
	 * BEGIN RENDER LOGIC
	 */
	new Engine(
		glCanvas.gl,
		shaderProgram,
		attributeManager,
		uniformManager,
		bufferManager,
		inputReferences,
		objectProperties,
	).start();
})();
