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
import { ISliderManager } from '~/Interfaces/HTML/ISliderManager';
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
		rotation: [0, 1],
		scale: [1, 1],
		width: 100,
		height: 30,
	};
	const sliderContainer: string = 'slider-container';

	const sliderManager: ISliderManager = {
		colorR: new Slider('colorR', sliderContainer, { min: 0, max: 100, step: 1, value: 50 }),
		colorG: new Slider('colorG', sliderContainer, { min: 0, max: 100, step: 1, value: 50 }),
		colorB: new Slider('colorB', sliderContainer, { min: 0, max: 100, step: 1, value: 50 }),
		colorW: new Slider('colorW', sliderContainer, { min: 0, max: 100, step: 1, value: 100 }),
		positionX: new Slider('positionX', sliderContainer, {
			min: 0,
			max: glCanvas.gl.canvas.width - objectProperties.width,
			step: 1,
			value: (glCanvas.gl.canvas.width - objectProperties.width) * 0.25,
		}),
		positionY: new Slider('positionY', sliderContainer, {
			min: 0,
			max: glCanvas.gl.canvas.height - objectProperties.height,
			step: 1,
			value: (glCanvas.gl.canvas.height - objectProperties.height) * 0.25,
		}),
		angle: new Slider('angle', sliderContainer, {
			min: 0,
			max: 360,
			step: 1,
			value: 0,
		}),
		scaleX: new Slider('scaleX', sliderContainer, {
			min: -500,
			max: 500,
			step: 1,
			value: 100,
		}),
		scaleY: new Slider('scaleY', sliderContainer, {
			min: -500,
			max: 500,
			step: 1,
			value: 100,
		}),
	};

	/**
	 * Bind UI References
	 */
	const inputReferences = new InputReferences(glCanvas.gl, sliderManager, objectProperties);

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
		positionAttributeLocation: {
			location: glCanvas.gl.getAttribLocation(shaderProgram, 'a_position'),
			size: 2,
			type: glCanvas.gl.FLOAT,
			normalize: false,
			stride: 0,
			offset: 0,
		},
	};

	const uniformManager: IUniformManager = {
		resolutionUniformLocation: glCanvas.gl.getUniformLocation(shaderProgram, 'u_resolution'),
		colorUniformLocation: glCanvas.gl.getUniformLocation(shaderProgram, 'u_color'),
		translationUniformLocation: glCanvas.gl.getUniformLocation(shaderProgram, 'u_translation'),
		rotationUniformLocation: glCanvas.gl.getUniformLocation(shaderProgram, 'u_rotation'),
		scaleUniformLocation: glCanvas.gl.getUniformLocation(shaderProgram, 'u_scale'),
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

	/**
	 * Send array of vertices to buffer
	 */
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
