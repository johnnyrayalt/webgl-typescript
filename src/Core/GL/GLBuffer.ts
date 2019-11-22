import { gl } from './GLUtilities';
import { IAttributeInfo } from '../../Interfaces/IAttributeInfo';

/**
 * Represents a WebGLBuffer
 */
export class GLBuffer {
	private hasAttributeLocation: boolean = false;
	private readonly elementSize: number;
	private readonly stride: number;
	private readonly buffer: WebGLBuffer;

	private readonly targetBufferType: number;
	private readonly dataType: number;
	private readonly mode: number;
	private readonly typeSize: number;

	private data: number[] = [];
	private attributes: IAttributeInfo[] = [];

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
		this.elementSize = elementSize;
		this.dataType = dataType;
		this.targetBufferType = targetBufferType;
		this.mode = mode;

		/**
		 * Determine byte size
		 */
		switch (this.dataType) {
			case gl.FLOAT:
			case gl.INT:
			case gl.UNSIGNED_INT:
				this.typeSize = 4;
				break;
			case gl.SHORT:
			case gl.UNSIGNED_SHORT:
				this.typeSize = 2;
				break;
			case gl.BYTE:
			case gl.UNSIGNED_BYTE:
				this.typeSize = 1;
				break;
			default:
				throw new Error(`Unrecognized data type: ${dataType.toString()}`);
		}

		this.stride = this.elementSize * this.typeSize;
		this.buffer = gl.createBuffer();
	}

	/**
	 * Destroys this buffer.
	 */
	public destroy = (): void => {
		gl.deleteBuffer(this.buffer);
	};

	/**
	 * Binds this buffer
	 * @param normalized | Indicates if the data should be normalized. default: false
	 */
	public bind = (normalized: boolean = false): void => {
		gl.bindBuffer(this.targetBufferType, this.buffer);

		if (this.hasAttributeLocation) {
			for (let it of this.attributes) {
				gl.vertexAttribPointer(
					it.location,
					it.size,
					this.dataType,
					normalized,
					this.stride,
					it.offset * this.typeSize,
				);
				gl.enableVertexAttribArray(it.location);
			}
		}
	};

	/**
	 * Unbinds this buffer.
	 */
	public unbind = (): void => {
		for (let it of this.attributes) {
			gl.disableVertexAttribArray(it.location);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	};

	/**
	 * Adds and attribute with the provided information to this buffer.
	 * @param info THe information to be added.
	 */
	public addAttributeLocation = (info: IAttributeInfo): void => {
		this.hasAttributeLocation = true;
		this.attributes.push(info);
	};

	/**
	 * Adds data to this buffer
	 * @param data
	 */
	public pushBackData = (data: number[]): void => {
		for (let d of data) {
			this.data.push(d);
		}
	};

	/**
	 * Uploads this buffers data to the GPU
	 */
	public upload = (): void => {
		gl.bindBuffer(this.targetBufferType, this.buffer);

		let bufferData: ArrayBuffer;
		switch (this.dataType) {
			case gl.FLOAT:
				bufferData = new Float32Array(this.data);
				break;
			case gl.INT:
				bufferData = new Int32Array(this.data);
				break;
			case gl.UNSIGNED_INT:
				bufferData = new Uint32Array(this.data);
				break;
			case gl.SHORT:
				bufferData = new Int16Array(this.data);
				break;
			case gl.UNSIGNED_SHORT:
				bufferData = new Uint16Array(this.data);
				break;
			case gl.BYTE:
				bufferData = new Int8Array(this.data);
				break;
			case gl.UNSIGNED_BYTE:
				bufferData = new Uint8Array(this.data);
				break;
		}

		gl.bufferData(this.targetBufferType, bufferData, gl.STATIC_DRAW);
	};

	/**
	 * Draws this buffer.
	 */
	public draw = (): void => {
		if (this.targetBufferType === gl.ARRAY_BUFFER) {
			gl.drawArrays(this.mode, 0, this.data.length / this.elementSize);
		} else if (this.targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
			gl.drawElements(this.mode, this.data.length, this.dataType, 0);
		}
	};
}