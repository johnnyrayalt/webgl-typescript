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

export interface GLArray {
	numComponents: number;
	data: number[];
}

export class GLBuffer {
	public buffer: WebGLBuffer;
	public bufferInfo: IBufferInfo = { attribs: {} };

	constructor(gl: WebGLRenderingContext, arrays: IObjectArrays) {
		this.bufferInfo = {
			attribs: this.createAttribsFromArrays(gl, arrays),
		};
		this.buffer = gl.createBuffer();
	}

	private createAttribsFromArrays = (gl: WebGLRenderingContext, arrays: IObjectArrays): IAttribBufferInfo => {
		const mapping = this.createMapping(arrays);
		const attribs: IAttribBufferInfo = {};
		Object.keys(mapping).forEach((name: string): void => {
			const bufferName = mapping[name];
			const originalArray = arrays[bufferName];
			const array = this.makeTypedArray(originalArray, bufferName);
			console.log(array);
			attribs[name] = {
				buffer: this.createBufferFromTypedArray(gl, array),
				numComponents: originalArray.numComponents || array.numComponents,
				type: this.GetGLTypeForTypedArray(gl, array),
				normalize: this.getNormalizationForTypedArray(array),
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
		return mapping;
	};

	private makeTypedArray = (array: any, name: string): any => {
		const isArrayBuffer = (array: any) => {
			return array.buffer && array.buffer instanceof ArrayBuffer;
		};

		if (isArrayBuffer(array)) {
			console.log('1 >> fired');
			return array;
		}

		if (array.data && isArrayBuffer(array.data)) {
			console.log('2 >> fired');
			return array.data;
		}

		if (Array.isArray(array)) {
			console.log('3 >> fired');
			array = {
				data: array,
			};
		}

		// if (!array.numComponents) {
		// 	console.log('4 >> fired');
		// 	array.numComponents = guessNumComponentsFromName(name, array.length);
		// }

		let type = array.type;
		if (!type) {
			console.log('5 >> fired');
			if (name === 'indices') {
				type = Uint16Array;
			}
		}
		const typedArray = this.createAugmentedTypedArray(
			array.numComponents,
			(array.data.length / array.numComponents) | 0,
			type,
		);
		typedArray.push(array.data);
		return typedArray;
	};

	private createAugmentedTypedArray = (numComponents: any, numElements: any, type: any): any => {
		const Type = type || Float32Array;
		return this.augmentTypedArray(new Type(numComponents * numElements), numComponents);
	};

	private augmentTypedArray = (typedArray: any, numComponents: any) => {
		let cursor: number = 0;
		typedArray.push = function() {
			for (let i = 0; i < arguments.length; i++) {
				const value = arguments[i];
				if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
					for (let j = 0; j < value.length; ++j) {
						typedArray[cursor++] = value[j];
					}
				} else {
					typedArray[cursor++] = value;
				}
			}
		};
		typedArray.reset = function(opt_index: number) {
			cursor = opt_index || 0;
		};
		typedArray.numComponents = numComponents;
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
		gl.bufferData(type, array.data.length, drawType || gl.STATIC_DRAW);
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
