import { gl } from '../GL/GLUtilities';

export class Shader {
	private readonly _name: string;
	private _program: WebGLProgram;
	private _attributes: { [name: string]: number } = {};
	private _uniforms: { [name: string]: WebGLUniformLocation } = {};

	/**
	 * Creates a new shader
	 * @param name | Name of the shader
	 * @param vertexSource | Source of the vertex for the shader
	 * @param fragmentSource | Source of the fragment for the shader
	 */
	public constructor(name: string, vertexSource: string, fragmentSource: string) {
		this._name = name;
		const vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
		const fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

		this.createProgram(vertexShader, fragmentShader);

		this.detectAttributes();
		this.detectUniforms();
	}

	/**
	 * Use shader
	 */
	public use = (): void => {
		gl.useProgram(this._program);
	};

	/**
	 * Gets the location of an attribute with a provided name
	 * @param name The name of the attribute to retrieve
	 */
	public getAttributeLocation = (name: string): number => {
		if (this._attributes[name] === undefined) {
			throw new Error(`Unable to find attribute name ${name} in shader ${this._name}`);
		}

		return this._attributes[name];
	};

	/**
	 * Gets the location of an uniform with the provided name
	 * @param name
	 */
	public getUniformLocation = (name: string): WebGLUniformLocation => {
		if (this._uniforms[name] === undefined) {
			throw new Error(`Unable to find uniform name ${name} in shader ${this._name}`);
		}

		return this._uniforms[name];
	};

	private loadShader = (source: string, shaderType: number): WebGLShader => {
		let shader: WebGLShader = gl.createShader(shaderType);

		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		let error = gl.getShaderInfoLog(shader);
		if (error !== '') {
			throw new Error(`Error compiling shader ${this._name}: ${error}`);
		}

		return shader;
	};

	private createProgram = (vertexShader: WebGLShader, fragmentShader: WebGLShader): void => {
		this._program = gl.createProgram();

		gl.attachShader(this._program, vertexShader);
		gl.attachShader(this._program, fragmentShader);

		gl.linkProgram(this._program);

		let error = gl.getProgramInfoLog(this._program);
		if (error !== '') {
			throw new Error(`Error linking shader ${this._name}: ${error}`);
		}
	};

	/**
	 * Stores Shaders name, type, and location to hash map _attributes
	 */
	private detectAttributes = (): void => {
		let attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
		for (let i = 0; i < attributeCount; i++) {
			let info: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
			if (!info) {
				break;
			}

			this._attributes[info.name] = gl.getAttribLocation(this._program, info.name);
		}
	};

	private detectUniforms = (): void => {
		let uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
		for (let i = 0; i < uniformCount; i++) {
			let info: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
			if (!info) {
				break;
			}

			this._uniforms[info.name] = gl.getUniformLocation(this._program, info.name);
		}
	};
}
