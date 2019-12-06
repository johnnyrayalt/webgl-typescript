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
	 * Creates and attaches shaders
	 */
	const loadShaders = GLShader.setShaders();
	const shader = new GLShader('basic', loadShaders[0], loadShaders[1]);

	/**
	 * Creates buffer
	 */
	const buffer = new GLBuffer(3);

	/**
	 * Create new Engine
	 */
	const engine = new Engine(inputReferences, canvas, shader, buffer);

	/**
	 * Start the program
	 */
	engine.start();
})();
