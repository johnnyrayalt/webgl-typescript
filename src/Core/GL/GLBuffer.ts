import { gl } from './GLUtilities';
import { IAttributeInfo } from '../../Interfaces/IAttributeInfo';

/**
 * Represents a WebGLBuffer
 */
export class GLBuffer {
	private _hasAttributeLocation: boolean = false;
	private readonly _elementSize: number;
	private readonly _stride: number;
	private readonly _buffer: WebGLBuffer;

	private readonly _targetBufferType: number;
	private readonly _dataType: number;
	private readonly _mode: number;
	private readonly _typeSize: number;

	private _data: number[] = [];
	private _attributes: IAttributeInfo[] = [];

	/**
	 * Creates a new GL Buffer.
	 * @param elementSize | The size of each element of this buffer.
	 * @param dataType | The data type of this buffer. default: GL.FLOAT
	 * @param targetBufferType | The buffer target type, accepts ARRAY_BUFFER of ELEMENT_ARRAY_BUFFER default: GL.ARRAY_BUFFER
	 * @param mode | The drawing mode of this buffer (i.e. GL.LINES, GL.TRIANGLES, etc...)  default: GL.TRIANGLES
	 */
	public constructor(
		elementSize: number,
		dataType: number = gl.FLOAT,
		targetBufferType: number = gl.ARRAY_BUFFER,
		mode: number = gl.TRIANGLES,
	) {
		this._elementSize = elementSize;
		this._dataType = dataType;
		this._targetBufferType = targetBufferType;
		this._mode = mode;

		/**
		 * Determine byte size
		 */
		switch (this._dataType) {
			case gl.FLOAT:
			case gl.INT:
			case gl.UNSIGNED_INT:
				this._typeSize = 4;
				break;
			case gl.SHORT:
			case gl.UNSIGNED_SHORT:
				this._typeSize = 2;
				break;
			case gl.BYTE:
			case gl.UNSIGNED_BYTE:
				this._typeSize = 1;
				break;
			default:
				throw new Error(`Unrecognized data type: ${dataType.toString()}`);
		}

		this._stride = this._elementSize * this._typeSize;
		this._buffer = gl.createBuffer();
	}

	/**
	 * Destroys this buffer.
	 */
	public destroy = (): void => {
		gl.deleteBuffer(this._buffer);
	};

	/**
	 * Binds this buffer
	 * @param normalized | Indicates if the data should be normalized. default: false
	 */
	public bind = (normalized: boolean = false): void => {
		gl.bindBuffer(this._targetBufferType, this._buffer);

		if (this._hasAttributeLocation) {
			for (let it of this._attributes) {
				gl.vertexAttribPointer(
					it.location,
					it.size,
					this._dataType,
					normalized,
					this._stride,
					it.offset * this._typeSize,
				);
				gl.enableVertexAttribArray(it.location);
			}
		}
	};

	/**
	 * Unbinds this buffer.
	 */
	public unbind = (): void => {
		for (let it of this._attributes) {
			gl.disableVertexAttribArray(it.location);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
	};

	/**
	 * Adds and attribute with the provided information to this buffer.
	 * @param info THe information to be added.
	 */
	public addAttributeLocation = (info: IAttributeInfo): void => {
		this._hasAttributeLocation = true;
		this._attributes.push(info);
	};

	/**
	 * Adds data to this buffer
	 * @param data
	 */
	public pushBackData = (data: number[]): void => {
		for (let d of data) {
			this._data.push(d);
		}
	};

	/**
	 * Uploads this buffers data to the GPU
	 */
	public upload = (): void => {
		gl.bindBuffer(this._targetBufferType, this._buffer);

		let bufferData: ArrayBuffer;
		switch (this._dataType) {
			case gl.FLOAT:
				bufferData = new Float32Array(this._data);
				break;
			case gl.INT:
				bufferData = new Int32Array(this._data);
				break;
			case gl.UNSIGNED_INT:
				bufferData = new Uint32Array(this._data);
				break;
			case gl.SHORT:
				bufferData = new Int16Array(this._data);
				break;
			case gl.UNSIGNED_SHORT:
				bufferData = new Uint16Array(this._data);
				break;
			case gl.BYTE:
				bufferData = new Int8Array(this._data);
				break;
			case gl.UNSIGNED_BYTE:
				bufferData = new Uint8Array(this._data);
				break;
		}

		gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);
	};

	/**
	 * Draws this buffer.
	 */
	public draw = (): void => {
		if (this._targetBufferType === gl.ARRAY_BUFFER) {
			gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
		} else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
			gl.drawElements(this._mode, this._data.length, this._dataType, 0);
		}
	};
}
