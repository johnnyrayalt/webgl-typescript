import { IObjectArrays } from '~Interfaces/GL/IObjectArrays';

export class TypedArray {
	public name: string;
	private readonly elementSize: number;
	private readonly targetBufferType: number;
	private readonly type: ArrayBuffer;
	private readonly mode: number;
	private readonly typeSize: number;

	private bufferData: ArrayBuffer;
	private data: number[] = [];

	constructor(gl: WebGLRenderingContext, array: IObjectArrays, name: string) {
		this.name = name;
		if (name === 'indeces') {
			this.type = new Uint16Array();
		}
	}
}
