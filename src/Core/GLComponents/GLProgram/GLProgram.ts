import { GLShader } from '~/Core/GLComponents/GLProgram/GLShaders';

export class GLProgram {
	private program: WebGLProgram;

	private gl: WebGL2RenderingContext;
	private vertexShader: WebGLShader;
	private fragmentShader: WebGLShader;

	constructor(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
		this.gl = gl;
		this.vertexShader = new GLShader(this.gl, gl.VERTEX_SHADER, vertexShaderSource).getShader();
		this.fragmentShader = new GLShader(this.gl, gl.FRAGMENT_SHADER, fragmentShaderSource).getShader();
		this.initWebGLProgram();
	}

	public getGLProgram = (): WebGLProgram => {
		return this.program;
	};

	private initWebGLProgram = (): void => {
		this.program = this.gl.createProgram();
		this.gl.attachShader(this.program, this.vertexShader);
		this.gl.attachShader(this.program, this.fragmentShader);
		this.gl.linkProgram(this.program);

		if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			throw new Error(`Could not init shader program`);
		}

		this.gl.useProgram(this.program);
	};
}
