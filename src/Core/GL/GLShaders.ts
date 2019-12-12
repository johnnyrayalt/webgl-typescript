import constants from '~/Assets/constants';
import { gl } from '~/Core/GL/GLCanvas';
import { GLSLWrapper } from '~/Core/Utilities/GLSLWrapper';
import { IAttributeHashMap } from '~/Interfaces/GL/IAttributeHashMap';
import { IUniformHashMap } from '~/Interfaces/GL/IUniformHashMap';
import { IStringHashMap } from '~/Interfaces/IStringHashMap';

/**
 * Main GLShader class. Handles creation, context setting, and linking of
 * vertex and fragment shaders into a single shader program
 * to be bound in GLBuffer
 */
export class GLShader {
	private readonly name: string;
	private attributeLocations: any = {};
	private uniformLocation: IUniformHashMap = {};
	private program: WebGLProgram;

	/**
	 * Creates a new shader
	 * @param {string} name | Name of the shader
	 * @param {string} vertexSource | Source of the vertex for the shader
	 * @param {string} fragmentSource | Source of the fragment for the shader
	 */
	public constructor(name: string, vertexSource: string, fragmentSource: string) {
		this.name = name;
		const vertexShader = this.loadShaderWithType(vertexSource, gl.VERTEX_SHADER);
		const fragmentShader = this.loadShaderWithType(fragmentSource, gl.FRAGMENT_SHADER);

		this.createProgram(vertexShader, fragmentShader);

		this.detectAttributes();
		this.detectUniforms();
	}

	/**
	 * Converts GLSL files to strings and returns an array of stringified shader objects
	 */
	public static loadShaders = (): string[] => {
		let shaderArray = [];
		const loadVertexShaderInput: string = GLSLWrapper.getShaderType(constants.shaders.type.vertexShader);
		const loadFragmentShaderInput: string = GLSLWrapper.getShaderType(constants.shaders.type.fragmentShader);
		const convertShaders: string[] = GLSLWrapper.convertFilesToString([loadVertexShaderInput, loadFragmentShaderInput]);

		const verticalShaderSource: string = convertShaders[0];
		const fragmentShaderSource: string = convertShaders[1];

		shaderArray.push(verticalShaderSource, fragmentShaderSource);
		return shaderArray;
	};

	/**
	 * Use shader
	 */
	public use = (): void => {
		gl.useProgram(this.program);
	};

	/**
	 * Gets and formats attributes
	 * @param {string} shader | GLSL shader as a string
	 * @param {number} numComponents | Number of components i.e. x, y, z.
	 * @param {number[]} data | Vertex data for the buffer
	 */
	public static getAttributes = (shader: string, numComponents: number, data: number[]): IAttributeHashMap => {
		const attributes = GLShader.getAttributeLocation(shader);
		let newAttrib: IAttributeHashMap = {};

		Object.values(attributes).forEach(value => {
			newAttrib[value] = {
				numComponents: numComponents,
				data: data,
			};
		});

		return newAttrib;
	};

	/**
	 * Gets uniforms
	 */
	public getUniforms = (): IUniformHashMap => {
		return this.uniformLocation;
	};

	/**
	 * Gets the location of an attribute with a provided name
	 * @param {string} shader | The stringified shader source
	 */
	private static getAttributeLocation = (shader: string): IStringHashMap => {
		const regex = new RegExp(/(?<=(attribute)\s[i|b]*[vec|mat]*(2|3|4)\s)([A-Za-z0-9_]+)/, 'g');
		const attributeNames: string[] = shader.match(regex);

		if (attributeNames === null) {
			return;
		}
		const attributeLocations: IStringHashMap = {};
		attributeNames.forEach((name: string) => {
			let id = 0;
			while (id < attributeNames.length) {
				attributeLocations[id++] = name;
			}
		});

		return attributeLocations;
	};

	/**
	 * Creates an empty WebGLShader object with vertex or fragment contexts
	 * @param {string} source | Source location for the shader
	 * @param {GLenum} shaderType | gl.VERTEX_SHADER || gl.FRAGMENT_SHADER
	 */
	private loadShaderWithType = (source: string, shaderType: number): WebGLShader => {
		let shader: WebGLShader = gl.createShader(shaderType);

		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		let error = gl.getShaderInfoLog(shader);
		if (error !== '') {
			throw new Error(`Error compiling shader ${this.name}: ${error}`);
		}

		return shader;
	};

	/**
	 * Links both shaders into a single program for WebGL consumption
	 * @param {WebGLShader} vertexShader | Vertex shader to use
	 * @param {WebGLShader} fragmentShader | Fragment shader to use
	 */
	private createProgram = (vertexShader: WebGLShader, fragmentShader: WebGLShader): void => {
		this.program = gl.createProgram();

		gl.attachShader(this.program, vertexShader);
		gl.attachShader(this.program, fragmentShader);

		gl.linkProgram(this.program);

		let error = gl.getProgramInfoLog(this.program);
		if (error !== '') {
			throw new Error(`Error linking shader ${this.name}: ${error}`);
		}
	};

	/**
	 * Stores Shaders attribute name, type, and location to hash map attributes
	 */
	private detectAttributes = (): void => {
		let attributeCount = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
		for (let i = 0; i < attributeCount; i++) {
			let info: WebGLActiveInfo = gl.getActiveAttrib(this.program, i);
			if (!info) {
				break;
			}

			this.attributeLocations[info.name] = gl.getAttribLocation(this.program, info.name);
		}
	};

	/**
	 * Stores Shaders uniform name, type, and location to hash map uniforms
	 */
	private detectUniforms = (): void => {
		let uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
		for (let i = 0; i < uniformCount; i++) {
			let info: WebGLActiveInfo = gl.getActiveUniform(this.program, i);
			if (!info) {
				break;
			}
			this.uniformLocation[info.name] = gl.getUniformLocation(this.program, info.name);
		}
	};
}
