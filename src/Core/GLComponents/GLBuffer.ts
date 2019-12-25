import { IObjectArrays } from '~Interfaces/GL/IObjectArrays';
import { TypedArray } from '~Core/Utilities/TypedArray';

export type TTypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array;

export interface IBufferInfo {
	attribs: IAttribBufferInfo;
}

export interface IAttribBufferInfo {
	[name: string]: {
		buffer: WebGLBuffer;
		numComponents: number;
		dataType: number;
		normalize: boolean;
	};
}

export interface GLArray {
	numComponents: number;
	data: number[];
	optType?:
		| Int8ArrayConstructor
		| Uint8ArrayConstructor
		| Int16ArrayConstructor
		| Uint16ArrayConstructor
		| Int32ArrayConstructor
		| Uint32ArrayConstructor
		| Float32ArrayConstructor;
}

export class GLBuffer {
	public buffer: WebGLBuffer;
	public bufferInfo: IBufferInfo = { attribs: {} };

	private mapping: { [name: string]: string } = {};

	constructor(gl: WebGLRenderingContext, arrays: IObjectArrays) {
		this.bufferInfo = {
			attribs: this.createAttribsFromArrays(gl, arrays),
		};
		this.buffer = gl.createBuffer();
		const bufferInfo = Object.assign({}, srcBufferInfo ? srcBufferInfo : {});
		bufferInfo.attribs = Object.assign({}, srcBufferInfo ? srcBufferInfo.attribs : {}, newAttribs);
		console.log('glbuffer', this.bufferInfo);
	}

	private createAttribsFromArrays = (gl: WebGLRenderingContext, arrays: IObjectArrays): IAttribBufferInfo => {
		this.mapping = this.createMapping(arrays);
		const attribs: IAttribBufferInfo = {};
		Object.keys(this.mapping).forEach((name: string): void => {
			const bufferName = this.mapping[name];
			const originalArray = arrays[bufferName];
			const typedArray = new TypedArray(gl, originalArray, bufferName);
			attribs[name] = {
				buffer: this.createBufferFromTypedArray(gl, typedArray),
				numComponents: typedArray.getNumComponents(),
				dataType: typedArray.getDataType(),
				normalize: typedArray.getNormalization(),
			};
		});
		return attribs;
	};

	private createMapping = (arrays: IObjectArrays): { [name: string]: string } => {
		const mapping: { [name: string]: string } = {};
		if (arrays['indeces']) {
			const noIndeces = (name: string): boolean => {
				return name !== 'indeces';
			};
			Object.keys(arrays)
				.filter(noIndeces)
				.forEach((key: string) => {
					mapping['a_' + key] = key;
				});
		} else {
			Object.keys(arrays).forEach((key: string) => {
				mapping['a_' + key] = key;
			});
		}
		return (this.mapping = mapping);
	};

	private createBufferFromTypedArray = (
		gl: WebGLRenderingContext,
		array: TypedArray,
		type?: number,
		drawType?: number,
	): WebGLBuffer => {
		type = type || gl.ARRAY_BUFFER;
		const buffer = gl.createBuffer();
		gl.bindBuffer(type, buffer);
		gl.bufferData(type, array.getData().length, drawType || gl.STATIC_DRAW);
		return buffer;
	};

	public bindBuffer = (gl: WebGLRenderingContext): void => {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	};

	public static setGeometry = (gl: WebGLRenderingContext, geometry: number[]): void => {
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);
	};
}
