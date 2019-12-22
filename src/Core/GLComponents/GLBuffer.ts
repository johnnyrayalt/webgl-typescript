import { IObjectArrays } from '~Interfaces/GL/IObjectArrays';

export interface TypedArray {
	[name: string]: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array;
}

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

export interface GLArray {
	numComponents: number;
	data: number[];
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
	}

	private createAttribsFromArrays = (gl: WebGLRenderingContext, arrays: IObjectArrays): IAttribBufferInfo => {
		this.mapping = this.createMapping(arrays);
		console.log(this.mapping);
		const attribs: IAttribBufferInfo = {};
		Object.keys(this.mapping).forEach((name: string): void => {
			const bufferName = this.mapping[name];
			const originalArray = arrays[bufferName];
			console.log(originalArray);
			const array: TypedArray = this.makeTypedArray(originalArray, bufferName);
			attribs[name] = {
				buffer: this.createBufferFromTypedArray(gl, array),
				numComponents: originalArray.numComponents || array.numComponents,
				type: this.GetGLTypeForTypedArray(gl, array),
				normalize: this.getNormalizationForTypedArray(array),
			};
		});
		console.log(attribs);
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

	private makeTypedArray = (array: GLArray, name: string): TypedArray => {
		let type: any;
		if (!type) {
			if (name === 'indices') {
				type = Uint16Array;
			}
		}

		const TypedArray = (): any => {
			const Type = type || Float32Array;
			return this.augmentTypedArray(
				new Type((array.numComponents * (array.data.length / array.numComponents)) | 0),
				array.numComponents,
			);
		};

		const typedArray = TypedArray();
		typedArray.push(array.data);
		console.log(typedArray);
		return typedArray;
	};

	private augmentTypedArray = (typedArray: TypedArray, numComponents: number): TypedArray => {
		console.log('96', typedArray);
		let cursor: number = 0;
		typedArray.push = function() {
			for (let i = 0; i < arguments.length; i++) {
				const value = arguments[i];
				if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
					for (let j = 0; j < value.length; ++j) {
						typedArray[cursor++] = value[j];
						console.log(typedArray[cursor++]);
					}
				} else {
					console.log(value);
					typedArray[cursor++] = value;
				}
			}
		};
		typedArray.reset = function(opt_index: number) {
			cursor = opt_index || 0;
		};
		typedArray.numComponents = numComponents;
		// Object.defineProperties(typedArray, {
		// 	push: function ()
		// })
		Object.defineProperty(typedArray, 'numElements', {
			get: function() {
				return (this.length / this.numComponents) | 0;
			},
		});
		return typedArray;
	};

	private createBufferFromTypedArray = (
		gl: WebGLRenderingContext,
		array: any,
		type?: number,
		drawType?: number,
	): WebGLBuffer => {
		type = type || gl.ARRAY_BUFFER;
		const buffer = gl.createBuffer();
		gl.bindBuffer(type, buffer);
		gl.bufferData(type, array.length, drawType || gl.STATIC_DRAW);
		return buffer;
	};

	private GetGLTypeForTypedArray = (gl: WebGLRenderingContext, typedArray: any): any => {
		switch (typedArray) {
			case typedArray instanceof Int8Array: {
				return gl.BYTE;
			}
			case typedArray instanceof Uint8Array: {
				return gl.UNSIGNED_BYTE;
			}
			case typedArray instanceof Int16Array: {
				return gl.SHORT;
			}
			case typedArray instanceof Uint16Array: {
				gl.UNSIGNED_SHORT;
			}
			case typedArray instanceof Int32Array: {
				return gl.INT;
			}
			case typedArray instanceof Uint32Array: {
				return gl.UNSIGNED_INT;
			}
			case typedArray instanceof Float32Array: {
				return gl.FLOAT;
			}
			default: {
				throw new Error(`Unsupported type: ${typedArray}`);
			}
		}
	};

	private getNormalizationForTypedArray = (typedArray: any): any => {
		if (typedArray instanceof Int8Array) {
			return true;
		} else {
			return false;
		}
	};

	public bindBuffer = (gl: WebGLRenderingContext): void => {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	};

	public static setGeometry = (gl: WebGLRenderingContext, geometry: number[]): void => {
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);
	};
}
