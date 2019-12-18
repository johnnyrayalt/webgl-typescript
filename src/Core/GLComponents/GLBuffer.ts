import { IObjectArrays } from '~Interfaces/GL/IObjectArrays';

export interface IBufferInfo {
	attribs: IAttribBufferInfo;
}

export interface IAttribBufferInfo {
	[name: string]: {
		buffer: WebGLBuffer;
		numComponents: number;
		type: number;
		normalize: boolean;
	};
}

export class GLBuffer {
	public buffer: WebGLBuffer;
	public bufferInfo: IBufferInfo = { attribs: {} };

	constructor(gl: WebGLRenderingContext, arrays: IObjectArrays, optionalMapping?: any) {
		this.bufferInfo = {
			attribs: this.createAttribsFromArrays(gl, arrays),
		};
		this.buffer = gl.createBuffer();
	}

	private createAttribsFromArrays = (gl: WebGLRenderingContext, arrays: IObjectArrays): IAttribBufferInfo => {
		const mapping = {};
		console.log(arrays);
		if (arrays['indeces']) {
			const noIndeces = (name: string): boolean => {
				return name !== 'indeces';
			};
			Object.keys(arrays)
				.filter(noIndeces)
				.forEach((key: string) => {
					console.log(key);
				});
		}
	};

	public bindBuffer = (gl: WebGLRenderingContext): void => {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	};

	public static setGeometry = (gl: WebGLRenderingContext, geometry: number[]): void => {
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);
	};
}
