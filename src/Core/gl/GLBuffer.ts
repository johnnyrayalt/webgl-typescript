import { gl } from './GLUtilities';

export class GLBuffer {
	private _elementSize: number;
	private _stride: number;
	private _buffer: WebGLBuffer;

	private _targetBufferType: number;
	private _dataType: number;
	private _mode: number;
	private _typeSize: number;

	private _data: number[] = [];

	/**
	 * Creates a new GL Buffer.
	 * @param elementSize | The size of each element of this buffer.
	 * @param dataType | The data type of this buffer. default: gl.FLOAT
	 * @param targetBufferType | The buffer target type, accepts ARRAY_BUFFER of ELEMENT_ARRAY_BUFFER default: gl.ARRAY_BUFFER
	 * @param mode | The drawing mode of this buffer (i.e. gl.LINES, gl.TRIANGLES, etc...)  default: gl.TRIANGLES
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
	}
}
