export interface IBufferInfo {
	[name: string]: {
		[name: string]: {
			buffer: WebGLBuffer;
			numComponents: number;
			type: number;
			normalize: boolean;
		};
	};
}

export class GLBuffer {
	public buffer: WebGLBuffer;
	public bufferInfo: IBufferInfo = {};

	constructor(gl: WebGLRenderingContext) {
		this.buffer = gl.createBuffer();
	}

	public bindBuffer = (gl: WebGLRenderingContext): void => {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	};

	public static setGeometry = (gl: WebGLRenderingContext, geometry: number[]): void => {
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);
	};
}
