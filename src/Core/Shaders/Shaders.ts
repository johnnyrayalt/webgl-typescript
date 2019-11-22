import { gl } from '../GL/GLUtilities';

export class Shader {
	private readonly name: string;
	private program: WebGLProgram;
	private attributes: { [name: string]: number } = {};
	private uniforms: { [name: string]: WebGLUniformLocation } = {};

	/**
	 * Creates a new shader
	 * @param name | Name of the shader
	 * @param vertexSource | Source of the vertex for the shader
	 * @param fragmentSource | Source of the fragment for the shader
	 */
	public constructor(name: string, vertexSource: string, fragmentSource: string) {
		this.name = name;
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
		gl.useProgram(this.program);
	};

	/**
	 * Gets the location of an attribute with a provided name
	 * @param name The name of the attribute to retrieve
	 */
	public getAttributeLocation = (name: string): number => {
		if (this.attributes[name] === undefined) {
			throw new Error(`Unable to find attribute name ${name} in shader ${this.name}`);
		}

		return this.attributes[name];
	};

	/**
	 * Gets the location of an uniform with the provided name
	 * @param name
	 */
	public getUniformLocation = (name: string): WebGLUniformLocation => {
		if (this.uniforms[name] === undefined) {
			throw new Error(`Unable to find uniform name ${name} in shader ${this.name}`);
		}

		return this.uniforms[name];
	};

	private loadShader = (source: string, shaderType: number): WebGLShader => {
		let shader: WebGLShader = gl.createShader(shaderType);

		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		let error = gl.getShaderInfoLog(shader);
		if (error !== '') {
			throw new Error(`Error compiling shader ${this.name}: ${error}`);
		}

		return shader;
	};

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
	 * Stores Shaders name, type, and location to hash map _attributes
	 */
	private detectAttributes = (): void => {
		let attributeCount = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
		for (let i = 0; i < attributeCount; i++) {
			let info: WebGLActiveInfo = gl.getActiveAttrib(this.program, i);
			if (!info) {
				break;
			}

			this.attributes[info.name] = gl.getAttribLocation(this.program, info.name);
		}
	};

	private detectUniforms = (): void => {
		let uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
		for (let i = 0; i < uniformCount; i++) {
			let info: WebGLActiveInfo = gl.getActiveUniform(this.program, i);
			if (!info) {
				break;
			}

			this.uniforms[info.name] = gl.getUniformLocation(this.program, info.name);
		}
	};
}
