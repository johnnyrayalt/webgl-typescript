import { gl } from '../gl/GLUtilities';

export class Shader {
	private readonly _name: string;
	private _program: WebGLProgram;
	/**
	 * Creates a new shader
	 * @param name Name of the shader
	 * @param vertexSource Source of the vertex for the shader
	 * @param fragmentSource Source of the fragment for the shader
	 */
	public constructor(name: string, vertexSource: string, fragmentSource: string) {
		this._name = name;
		const vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
		const fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

		this.createProgram(vertexShader, fragmentShader);
	}

	/**
	 * Use shader
	 */
	public use = (): void => {
		gl.useProgram(this._program);
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
}
