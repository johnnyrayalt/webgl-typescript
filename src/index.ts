import { GLBuffer } from '~/Core/GL/GLBuffer';
import { GLCanvas } from '~/Core/GL/GLCanvas';
import { GLShader } from '~/Core/GL/GLShaders';
import { CreateUI } from '~Core/Utilities/CreateUI';
import { Engine } from './Core/Engine';
import { InputReferences } from './Core/Utilities/InputReferences';
require('./Assets/IndexStyles.css');

(() => {
	/**
	 * Create UI Elements
	 */
	CreateUI.bootStrapUI();

	/**
	 * Initialize new Canvas
	 */
	const canvas = GLCanvas.initialize();

	/**
	 * Binds UI inputs
	 */
	const inputReferences = new InputReferences();

	/**
	 * Gets and sets shaders files as strings
	 */
	const loadShaders = GLShader.setShaders();
	/**
	 * Creates a new WebGLProgram from the two supplies WebGLShaders
	 * @param {string} | name of the WebGLProgram
	 * @param {WebGLShader} | The Vertex Shader
	 * @param {WebGLShader} | The Fragment Shader
	 */
	const shader = new GLShader('basic', loadShaders[0], loadShaders[1]);

	/**
	 * Creates buffer
	 * @param {number} | elementSize
	 */
	const buffer = new GLBuffer(3);

	/**
	 * Create new Engine
	 * @param {InputReferences} | Bound inputReferences
	 * @param {HTMLCanvasElement} | Initialized canvas
	 * @param {WebGLProgram} | Linked WebGLShaders
	 * @param {WebGLBuffer} | Buffer context
	 */
	const engine = new Engine(inputReferences, canvas, shader, buffer);

	/**
	 * Start the program
	 */
	engine.start();
})();
