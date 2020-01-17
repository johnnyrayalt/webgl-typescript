import { GLBuffer } from '~/Core/GLComponents/GLBuffer';
import { GLProgram } from './Core/GLComponents/GLProgram/GLProgram';
import { GLCanvas } from '~/Core/GLComponents/GLCanvas';
// @ts-ignore
import FragmentShader from '~/Core/Shaders/fragment.frag';
// @ts-ignore
import VertexShader from '~/Core/Shaders/vertex.vert';

const canvas = new GLCanvas();
const gl = canvas.getGLContext();
canvas.clearColor([0, 0, 0, 1]);

// WebGL2 Application Setup

// Set up state
const glProgram = new GLProgram(gl, VertexShader, FragmentShader).getGLProgram();

// Attributes
const aVertexPosition = gl.getAttribLocation(glProgram, 'aVertexPosition');

// object data
// prettier-ignore
const vertices = [
			-0.5,    0.5,    0,
			-0.5,   -0.5,    0,
			0.5,   -0.5,    0,
			0.5,    0.5,    0
		];
const indices = [0, 1, 2, 0, 2, 3];

const positionBuffer = new GLBuffer(gl, vertices, indices, aVertexPosition);

const draw = (): void => {
	// clear the scene
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Bind VAO
	gl.bindVertexArray(positionBuffer.getVAO());

	// bind ibo
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, positionBuffer.getIndicesBufferObject());

	// draw to the scene using triangle primitives
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

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
