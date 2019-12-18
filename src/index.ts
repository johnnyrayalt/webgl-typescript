import { GLAttributes } from './Core/GLComponents/GLAttributes';
import { GLUniforms } from './Core/GLComponents/GLUniforms';
import { Engine } from '~/Core/Engine';
import { LetterU } from '~/Core/Geometry/LetterU';
import { GLBuffer } from '~/Core/GLComponents/GLBuffer';
import { GLCanvas } from '~/Core/GLComponents/GLCanvas';
import { GLShader } from '~/Core/GLComponents/GLShader';
// @ts-ignore
import BasicFragmentShader from '~/Core/Shaders/FragmentShaders/BasicFragmentShader.frag';
// @ts-ignore
import SphereFragShader from '~/Core/Shaders/SphereFragShader.frag';
// @ts-ignore
import BasicVertexShader from '~/Core/Shaders/VertexShaders/BasicVertexShader.vert';
// @ts-ignore
import SphereVertShader from '~/Core/Shaders/VertexShaders/SphereVertShader.vert';
import { Canvas } from '~/Core/Utilities/HTMLElements/Canvas';
import { InputReferences } from '~/Core/Utilities/HTMLElements/InputReferences';
import { Slider } from '~/Core/Utilities/HTMLElements/Slider';
import { IAttributeManager } from '~/Interfaces/GL/IAttributeManager';
import { IBufferManager } from '~/Interfaces/GL/IBufferManager';
import { IUniformManager } from '~/Interfaces/GL/IUniformManager';
import { ISliderManager } from '~/Interfaces/HTML/ISliderManager';
import { IObjectProperties } from '~/Interfaces/IObjectProperties';
import { IObjectArrays } from '~Interfaces/GL/IObjectArrays';
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

	/**
	 * @type {IObjectProperties} | Default options to be passed to value store
	 */
	const objectProperties: IObjectProperties = {
		translation: [0, 0],
		rotation: [0, 1],
		scale: [1, 1],
		width: 100,
		height: 30,
	};

	/**
	 * @type {ISliderManager} | Hashmap for all sliders objects with options
	 */
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
	 * Create buffers for attributes to recieve data
	 */
	const bufferManager: IBufferManager = {
		positionBuffer: new GLBuffer(glCanvas.gl),
	};

	/**
	 * @returns {GLUniforms} class with appropriate vector or matrix transformation method based on uniform type
	 */
	const uniformSetters: GLUniforms = new GLUniforms(glCanvas.gl, shaderProgram);
	const attributeSetters: GLAttributes = new GLAttributes(glCanvas.gl, shaderProgram);
	console.log(attributeSetters);

	const objectArrays: IObjectArrays = {
		position: { numComponents: 3, data: [0, -10, 0, 10, 10, 0, -10, 10, 0] },
		texcoord: { numComponents: 2, data: [0.5, 0, 1, 1, 0, 1] },
		normal: { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1] },
	};

	/**
	 * gets Attributes and Uniforms
	 */
	const attributeManager: IAttributeManager = {
		a_position: {
			index: glCanvas.gl.getAttribLocation(shaderProgram, 'a_position'),
			size: 2,
			type: glCanvas.gl.FLOAT,
			normalize: false,
			stride: 0,
			offset: 0,
		},
	};

	const uniformManager: IUniformManager = {
		u_resolution: glCanvas.gl.getUniformLocation(shaderProgram, 'u_resolution'),
		u_color: glCanvas.gl.getUniformLocation(shaderProgram, 'u_color'),
		u_translation: glCanvas.gl.getUniformLocation(shaderProgram, 'u_translation'),
		u_rotation: glCanvas.gl.getUniformLocation(shaderProgram, 'u_rotation'),
		u_scale: glCanvas.gl.getUniformLocation(shaderProgram, 'u_scale'),
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
