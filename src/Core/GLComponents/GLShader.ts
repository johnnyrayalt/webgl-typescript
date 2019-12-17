export class GLShader {
	public readonly name: string;
	public readonly type: number;
	public readonly source: string;
	public readonly shader: WebGLShader;

	constructor(gl: WebGLRenderingContext, name: string, type: number, source: string) {
		this.name = name;
		this.type = type;
		this.source = source;
		this.shader = this.createShader(gl);
	}

	private createShader = (gl: WebGLRenderingContext): WebGLShader => {
		const shader = gl.createShader(this.type);
		gl.shaderSource(shader, this.source);
		gl.compileShader(shader);
		const error = gl.getShaderInfoLog(shader);
		if (error !== '') {
			gl.deleteShader(shader);
			throw new Error(`Error compiling shader from source: ${this.name}: ${error}`);
		}

		return shader;
	};

	public static createProgram = (
		gl: WebGLRenderingContext,
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader,
	): WebGLProgram => {
		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		const error = gl.getProgramInfoLog(program);
		if (error !== '') {
			gl.deleteProgram(program);
			throw new Error(`Error linking shaders into program: ${error}`);
		}

		return program;
	};
}
