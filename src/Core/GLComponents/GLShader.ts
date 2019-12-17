export class GLShader {
	name: string;
	shader: WebGLShader;

	constructor(gl: WebGLRenderingContext, name: string, type: number, source: string) {
		this.name = name;
		this.shader = this.createShader(gl, type, source);
	}

	private createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		const error = gl.getShaderInfoLog(shader);
		if (error !== '') {
			gl.deleteShader(shader);
			throw new Error(`Error compiling shader from source: ${source}: ${error}`);
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
