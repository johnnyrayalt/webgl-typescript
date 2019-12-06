import { gl } from '~/Core/GL/GLCanvas';
import { GLShader } from '~/Core/GL/GLShaders';
import { IAttributeInfo } from '~/Interfaces/GL/IAttributeInfo';

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
	 * @param {GLenum} elementSize | The size of each element of this buffer i.e. 3 for triangle etc....
	 * @param {GLenum} dataType | The data type of this buffer. default: GL.FLOAT
	 * @param {GLenum} targetBufferType | The buffer target type, accepts ARRAY_BUFFER of ELEMENT_ARRAY_BUFFER default: GL.ARRAY_BUFFER
	 * @param {GLenum} mode | The drawing mode of this buffer (i.e. GL.LINES, GL.TRIANGLES, etc...)  default: GL.TRIANGLES
	 */
	public constructor(
		elementSize: number,
		dataType: number = gl.FLOAT,
		targetBufferType: number = gl.ARRAY_BUFFER,
		mode: number = gl.TRIANGLES,
	) {
		this.buffer = gl.createBuffer();
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
	}

	/**
	 * Creates and stands up a new Buffer given a shader program and object geometry as vertices.
	 * @param {GLShader} shader | Current shader program
	 */
	public createBuffer = (shader: GLShader): void => {
		const positionAttribute: IAttributeInfo = {
			location: shader.getAttributeLocation('a_position'),
			offset: 0,
			size: 3,
		};

		this.addAttributeLocation(positionAttribute);
		// triangle
		// prettier-ignore
		const vertices = [
			// top triangle
			0,    0,    0, // x
			0,    0.5,  0, // y
			0.5,  0.5,  0, // z

			// bottom triangle
			0.5,  0.5,  0,
			0.5,  0,    0,
			0,    0,    0,
		];

		this.pushBackData(vertices);
		this.upload();
		this.unbind();
	};

	/**
	 * Destroys this buffer.
	 */
	public destroy = (): void => {
		gl.deleteBuffer(this.buffer);
	};

	/**
	 * Binds this buffer
	 * @param {boolean} normalized | Indicates if the data should be normalized. default: false
	 */
	public bind = (normalized: boolean = false): void => {
		gl.bindBuffer(this.targetBufferType, this.buffer);

		if (this.hasAttributeLocation) {
			for (let it of this.attributes) {
				gl.vertexAttribPointer(it.location, it.size, this.dataType, normalized, this.stride, it.offset * this.typeSize);
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
	 * @param {IAttributeInfo} info | The information to be added.
	 */
	public addAttributeLocation = (info: IAttributeInfo): void => {
		this.hasAttributeLocation = true;
		this.attributes.push(info);
	};

	/**
	 * Adds data to this buffer
	 * @param {number[]} data | Data to be added to the buffer
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
