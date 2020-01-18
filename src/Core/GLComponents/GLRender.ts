import { mat4 } from 'gl-matrix';
import { GLBuffer } from '~/Core/GLComponents/GLBuffer';

export class GLRender {
	private gl: WebGL2RenderingContext;
	private glProgram: WebGLProgram;
	private positionBuffer: GLBuffer;
	private indices: number[];
	private projectionMatrix: mat4;
	private modelViewMatrix: mat4;

	private uniformMatrixMap: { [name: string]: WebGLUniformLocation } = {};

	constructor(
		gl: WebGL2RenderingContext,
		glProgram: WebGLProgram,
		positionBuffer: GLBuffer,
		indices: number[],
		projectionMatrix: mat4,
		modelViewMatrix: mat4,
	) {
		this.gl = gl;
		this.glProgram = glProgram;
		this.positionBuffer = positionBuffer;
		this.indices = indices;
		this.projectionMatrix = projectionMatrix;
		this.modelViewMatrix = modelViewMatrix;
	}

	public loop = () => {
		this.draw(this.projectionMatrix, this.modelViewMatrix);
		requestAnimationFrame(this.loop.bind(this));
	};

	private draw = (projectionMatrix: mat4, modelViewMatrix: mat4): void => {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

		mat4.perspective(projectionMatrix, 45, this.gl.canvas.width / this.gl.canvas.height, 0.1, 10000);
		mat4.identity(modelViewMatrix);
		mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -5]);

		this.detectUniforms();

		Object.keys(this.uniformMatrixMap).forEach((name: string) => {
			if (name === 'uProjectionMatrix') this.gl.uniformMatrix4fv(this.uniformMatrixMap[name], false, projectionMatrix);
			if (name === 'uModelViewMatrix') this.gl.uniformMatrix4fv(this.uniformMatrixMap[name], false, modelViewMatrix);
		});

		// Bind VAO
		this.gl.bindVertexArray(this.positionBuffer.getVAO());

		// bind ibo
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.positionBuffer.getIndicesBufferObject());

		// draw to the scene using Line loop primitives
		this.gl.drawElements(this.gl.LINE_LOOP, this.indices.length, this.gl.UNSIGNED_SHORT, 0);

		// clean up
		this.gl.bindVertexArray(null);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	};

	private detectUniforms = (): void => {
		const numUniforms = this.gl.getProgramParameter(this.glProgram, this.gl.ACTIVE_UNIFORMS);
		for (let uniformIndex = 0; uniformIndex < numUniforms; uniformIndex++) {
			const uniformInfo: WebGLActiveInfo = this.gl.getActiveUniform(this.glProgram, uniformIndex);
			if (!uniformInfo) {
				break;
			}
			this.uniformMatrixMap[uniformInfo.name] = this.gl.getUniformLocation(this.glProgram, uniformInfo.name);
		}
	};
}
