export class GLBuffer {
	private VAO: WebGLVertexArrayObject;
	private verticesBufferObject: WebGLBuffer;
	private indicesBufferObject: WebGLBuffer;

	private gl: WebGL2RenderingContext;
	private vertices: number[];
	private indices: number[];

	constructor(gl: WebGL2RenderingContext, vertices: number[], indices: number[], positionAttrib: number) {
		this.gl = gl;
		this.vertices = vertices;
		this.indices = indices;
		this.VAO = this.gl.createVertexArray();
		this.verticesBufferObject = this.gl.createBuffer();
		this.indicesBufferObject = this.gl.createBuffer();

		this.gl.bindVertexArray(this.VAO);

		this.bindVBO();
		this.giveAttribstoVAO(positionAttrib);
		this.bindIBO();
		this.cleanBuffers();
	}

	public getVAO = (): WebGLVertexArrayObject => {
		return this.VAO;
	};

	public getIndicesBufferObject = (): WebGLBuffer => {
		return this.indicesBufferObject;
	};

	private bindVBO = (): void => {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.verticesBufferObject);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
	};

	private giveAttribstoVAO = (aVertexPosition: number) => {
		// Only works with position attribute currently
		this.gl.enableVertexAttribArray(aVertexPosition);
		this.gl.vertexAttribPointer(aVertexPosition, 3, this.gl.FLOAT, false, 0, 0);
	};

	private bindIBO = (): void => {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indicesBufferObject);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
	};

	private cleanBuffers = (): void => {
		this.gl.bindVertexArray(null);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	};
}
