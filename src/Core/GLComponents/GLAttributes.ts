import { IAttributeManager } from '~/Interfaces/GL/IAttributeManager';
import { IBufferManager } from './../../Interfaces/GL/IBufferManager';

export class GLAttributes {
	public attributeSetters: { [name: string]: Function } = {};
	private numAttributes: number;

	constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
		this.numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

		for (let attributeIndex: number = 0; attributeIndex < this.numAttributes; attributeIndex++) {
			const attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(program, attributeIndex);
			if (!attributeInfo) {
				break;
			}

			const index: number = gl.getAttribLocation(program, attributeInfo.name);

			this.attributeSetters[attributeInfo.name] = this.createSetter(gl, index, attributeInfo.name);
		}
	}

	private createSetter = (gl: WebGLRenderingContext, index: number, key: string): Function => {
		return (bufferManager: IBufferManager, attributeManager: IAttributeManager) => {
			gl.bindBuffer(gl.ARRAY_BUFFER, bufferManager[key]);
			gl.enableVertexAttribArray(index);
			gl.vertexAttribPointer(
				index,
				attributeManager[key].numComponents || attributeManager[key].size,
				attributeManager[key].type || gl.FLOAT,
				attributeManager[key].normalize || false,
				attributeManager[key].stride || 0,
				attributeManager[key].offset || 0,
			);
		};
	};
}
