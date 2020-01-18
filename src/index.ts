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
import { GLRender } from './Core/GLComponents/GLRender';

const projectionMatrix: mat4 = mat4.create();
const modelViewMatrix: mat4 = mat4.create();

const canvas = new GLCanvas();
const gl = canvas.getGLContext();
canvas.clearColor([0, 0, 0, 1]);

// WebGL2 Application Setup

// Set up state
const glProgram: WebGLProgram = new GLProgram(gl, VertexShader, FragmentShader).getGLProgram();

// // Attributes
const aVertexPosition = gl.getAttribLocation(glProgram, 'aVertexPosition');

const positionBuffer = new GLBuffer(gl, vertices, indices, aVertexPosition);

const start = (): void => {
	canvas.resize();
	canvas.clearColor([0, 0, 0, 1]);
	new GLRender(gl, glProgram, positionBuffer, indices, projectionMatrix, modelViewMatrix).loop();
};

((): void => {
	start();
})();
