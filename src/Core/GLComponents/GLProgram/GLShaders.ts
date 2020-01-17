export class GLShader {
	private shader: WebGLShader;

	private gl: WebGL2RenderingContext;
	private type: GLenum;
	private shaderSource: string;

	constructor(gl: WebGL2RenderingContext, type: GLenum, shaderSource: string) {
		this.gl = gl;
		this.type = type;
		this.shaderSource = shaderSource;
		this.createShader();
	}

	public getShader = (): WebGLShader => {
		return this.shader;
	};

	private createShader = (): void => {
		const shader = this.gl.createShader(this.type);
		this.gl.shaderSource(shader, this.shaderSource);
		this.gl.compileShader(shader);
		this.shader = shader;
	};
}
