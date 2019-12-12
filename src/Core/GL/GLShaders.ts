import constants from '~/Assets/constants';
import { gl } from '~/Core/GL/GLCanvas';
import { GLSLWrapper } from '~/Core/Utilities/GLSLWrapper';
import { IAttributeHashMap } from '~/Interfaces/GL/IAttributeHashMap';
import { IUniformHashMap } from '~/Interfaces/GL/IUniformHashMap';
import { INumHashMap } from '~Interfaces/INumHashMap';

/**
 * Main GLShader class. Handles creation, context setting, and linking of
 * vertex and fragment shaders into a single shader program
 * to be bound in GLBuffer
 */
export class GLShader {
	private readonly name: string;
	private attributes: IAttributeHashMap = {};
	private attributeLocations: INumHashMap = {};
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
	public getAttributes = (shader: string, numComponents: number, data: number[]): IAttributeHashMap => {
		this.getAttributeLocation(shader);
		Object.keys(this.attributeLocations).forEach((key: string) => {
			this.attributes[key] = {
				numComponents: numComponents,
				data: data,
			};
		});

		return this.attributes;
	};

	/**
	 * Gets and formats uniforms
	 * @param {string} shader | GLSL shader as a string.
	 */
	public getUniforms = (): IUniformHashMap => {
		// this.getUniformLocation(shader);

		// Object.keys(this.uniformLocation).forEach((key: string) => {
		// 	this.uniforms[key] = this.uniformLocation;
		// });

		return this.uniformLocation;
	};

	/**
	 * Gets the location of an attribute with a provided name
	 * @param {string} shader | The stringified shader source
	 */
	private getAttributeLocation = (shader: string): INumHashMap => {
		const regex = new RegExp(/(?<=(attribute)\s[i|b]*[vec|mat]*(2|3|4)\s)([A-Za-z0-9_]+)/, 'g');
		const attributeNames: string[] = shader.match(regex);

		if (attributeNames === null) {
			return;
		}

		attributeNames.forEach((name: string) => {
			this.attributeLocations[name];
		});

		return this.attributeLocations;
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
