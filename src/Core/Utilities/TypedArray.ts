import { GLArray, TTypedArray } from '~Core/GLComponents/GLBuffer';

export class TypedArray {
	public readonly name: string;
	private arrayType: TTypedArray;
	private numComponents: number;
	private dataType: GLenum;
	private data: number[] = [];
	private normalize: boolean;

	constructor(gl: WebGLRenderingContext, array: GLArray, name: string) {
		this.name = name;
		this.data = array.data;
		this.numComponents = array.numComponents;

		if (array.optType) {
			const Type = array.optType;
			this.arrayType = new Type(this.data);
		} else if (name === 'indeces') {
			this.arrayType = new Uint16Array(this.data);
		} else {
			this.arrayType = new Float32Array(this.data);
		}

		this.setGLTypeForTypedArray(gl);
		this.setNormalization();
	}

	public getArrayType = (): TTypedArray => {
		return this.arrayType;
	};

	public getNumComponents = (): number => {
		return this.numComponents;
	};

	public getDataType = (): GLenum => {
		return this.dataType;
	};

	public getNormalization = (): boolean => {
		return this.normalize;
	};

	private setGLTypeForTypedArray = (gl: WebGLRenderingContext): void => {
		switch (true) {
			case this.arrayType instanceof Int8Array: {
				this.dataType = gl.BYTE;
				break;
			}
			case this.arrayType instanceof Uint8Array: {
				this.dataType = gl.UNSIGNED_BYTE;
				break;
			}
			case this.arrayType instanceof Int16Array: {
				this.dataType = gl.SHORT;
				break;
			}
			case this.arrayType instanceof Uint16Array: {
				this.dataType = gl.UNSIGNED_SHORT;
				break;
			}
			case this.arrayType instanceof Int32Array: {
				this.dataType = gl.INT;
				break;
			}
			case this.arrayType instanceof Uint32Array: {
				this.dataType = gl.UNSIGNED_INT;
				break;
			}
			case this.arrayType instanceof Float32Array: {
				this.dataType = gl.FLOAT;
				break;
			}
			default: {
				throw new Error(`Unsupported type: ${this.arrayType}`);
			}
		}
	};

	private setNormalization = (): void => {
		if (this.arrayType instanceof Int8Array) {
			this.normalize = true;
		} else {
			this.normalize = false;
		}
	};
}
