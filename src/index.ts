import { mat4 } from 'gl-matrix';
import { GLBuffer } from '~/Core/GLComponents/GLBuffer';
import { GLCanvas } from '~/Core/GLComponents/GLCanvas';
// @ts-ignore
import FragmentShader from '~/Core/Shaders/fragment.frag';
// @ts-ignore
import VertexShader from '~/Core/Shaders/vertex.vert';
import { indices } from './Core/Geometry/indices';
import { vertices } from './Core/Geometry/vertices';
import { GLProgram } from './Core/GLComponents/GLProgram/GLProgram';

const projectionMatrix = mat4.create();
const modelViewMatrix = mat4.create();

const canvas = new GLCanvas();
const gl = canvas.getGLContext();
canvas.clearColor([0, 0, 0, 1]);

// WebGL2 Application Setup

// Set up state
const glProgram = new GLProgram(gl, VertexShader, FragmentShader).getGLProgram();

// // Attributes & Uniforms
const aVertexPosition = gl.getAttribLocation(glProgram, 'aVertexPosition');
// const uModelViewMatrix = gl.getUniformLocation(glProgram, 'uModelViewMatrix');
// const uProjectionMatrix = gl.getUniformLocation(glProgram, 'uProjectionMatrix');

const positionBuffer = new GLBuffer(gl, vertices, indices, aVertexPosition);

const draw = (): void => {
	// clear the scene
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 10000);
	mat4.identity(modelViewMatrix);
	mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -5]);

	const numUniforms = gl.getProgramParameter(glProgram, gl.ACTIVE_UNIFORMS);
	let uniformIndex: number;
	let uniformMatrixMap: { [name: string]: WebGLUniformLocation } = {};
	for (uniformIndex = 0; uniformIndex < numUniforms; uniformIndex++) {
		const uniformInfo: WebGLActiveInfo = gl.getActiveUniform(glProgram, uniformIndex);
		if (!uniformInfo) {
			break;
		}
		uniformMatrixMap[uniformInfo.name] = gl.getUniformLocation(glProgram, uniformInfo.name);
	}

	// TODO:: Less hardcodedness please
	Object.keys(uniformMatrixMap).forEach((name: string) => {
		if (name === 'uProjectionMatrix') gl.uniformMatrix4fv(uniformMatrixMap[name], false, projectionMatrix);
		if (name === 'uModelViewMatrix') gl.uniformMatrix4fv(uniformMatrixMap[name], false, modelViewMatrix);
	});

	// Bind VAO
	gl.bindVertexArray(positionBuffer.getVAO());

	// bind ibo
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, positionBuffer.getIndicesBufferObject());

	// draw to the scene using triangle primitives
	gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0);

	// clean up
	gl.bindVertexArray(null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

const start = (): void => {
	canvas.resize();
	canvas.clearColor([0, 0, 0, 1]);
	draw();
};

((): void => {
	start();
})();
