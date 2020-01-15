import { GLCanvas } from '~/Core/GLComponents/GLCanvas';
// @ts-ignore
import FragmentShader from '~/Core/Shaders/fragment.frag';
// @ts-ignore
import VertexShader from '~/Core/Shaders/vertex.vert';

let gl: WebGL2RenderingContext,
	program: WebGLProgram,
	vertexBuffer: WebGLBuffer,
	indexBuffer: WebGLBuffer,
	indices: number[],
	aVertexPosition: number;

const canvas = new GLCanvas();
gl = canvas.getGLContext();
canvas.clearColor([0, 0, 0, 1]);

// WebGL2 Application Setup
// Vertex Shader
const initProgram = (): void => {
	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, VertexShader);
	gl.compileShader(vertexShader);

	// Fragment Shader
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, FragmentShader);
	gl.compileShader(fragmentShader);

	// Shader Program
	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(`Could not initialize shaders`);
	}

	gl.useProgram(program);
	aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
};

const initBuffers = (): void => {
	// object data
	// @ts-ignore
	// prettier-ignore
	const vertices = [
			-0.5,    0.5,    0,
			-0.5,   -0.5,    0,
			0.5,   -0.5,    0,
			0.5,    0.5,    0
		];
	indices = [0, 1, 2, 0, 2, 3];

	// VBO: Vertex Buffer Object
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	// IBO: Index Buffer Object
	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	// Clean up by unbinding buffers
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

const draw = (): void => {
	// clear the scene
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Use the buffers that were just made
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(aVertexPosition);

	// bind ibo
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	// draw to the scene using triangle primitives
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

	// clean up
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

const start = (): void => {
	canvas.resize();
	canvas.clearColor([0, 0, 0, 1]);

	initProgram();
	initBuffers();
	draw();
};

((): void => {
	start();
})();
