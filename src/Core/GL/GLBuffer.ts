import { gl } from '~/Core/GL/GLCanvas';
import { IAttributeInfo } from '~/Interfaces/GL/IAttributeInfo';
import { IAttributeHashMap } from '~Interfaces/GL/IAttributeHashMap';

/**
 * Represents a WebGLBuffer
 */
export class GLBuffer {
	private hasAttributeLocation: boolean = false;
	private readonly elementSize: number;
	private readonly buffer: WebGLBuffer;

	private readonly targetBufferType: number;
	private readonly dataType: number;
	private readonly primitiveType: number;
	private readonly typeSize: number;

	private data: number[] = [];
	private attributes: IAttributeInfo[] = [];

	/**
	 * Creates a new GL Buffer.
	 * @param {GLenum} elementSize | The size of each element of this buffer i.e. 3 for triangle etc....
	 * @param {GLenum} dataType | The data type of this buffer. default: GL.FLOAT
	 * @param {GLenum} targetBufferType | The buffer target type, accepts ARRAY_BUFFER of ELEMENT_ARRAY_BUFFER default: GL.ARRAY_BUFFER
	 * @param {GLenum} primitiveType | The drawing type of this buffer (i.e. GL.LINES, GL.TRIANGLES, etc...)  default: GL.TRIANGLES
	 */
	public constructor(
		elementSize: number,
		dataType: number = gl.FLOAT,
		targetBufferType: number = gl.ARRAY_BUFFER,
		primitiveType: number = gl.TRIANGLES,
	) {
		this.buffer = gl.createBuffer();
		this.elementSize = elementSize;
		this.dataType = dataType;
		this.targetBufferType = targetBufferType;
		this.primitiveType = primitiveType;

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
	}

	/**
	 * Creates and stands up a new Buffer given a shader program and object geometry as vertices.
	 * @param {GLShader} shader | Current shader program
	 */
	public createBufferInfo = (attributeIndex: IAttributeHashMap): void => {
		Object.keys(attributeIndex).forEach((key: string) => {
			const attribute: any = {
				location: attributeIndex[key],
				offest: 0,
				count: attributeIndex[key].numComponents,
			};
			this.addAttributeLocation(attribute);
			const data: number[] = attributeIndex[key].data;
			this.pushBackData(data);
			this.upload();
			this.unbind();
		});
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
	public bindAttributes = (normalized: boolean = false): void => {
		gl.bindBuffer(this.targetBufferType, this.buffer);

		if (this.hasAttributeLocation) {
			for (let it of this.attributes) {
				gl.vertexAttribPointer(it.location, it.count, this.dataType, normalized, 0, it.offset * this.typeSize);
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
			gl.drawArrays(this.primitiveType, 0, this.data.length / this.elementSize);
		} else if (this.targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
			gl.drawElements(this.primitiveType, this.data.length, this.dataType, 0);
		} else {
			throw new Error('Invalid target buffer type');
		}
	};
}
