import { IAttributeManager } from '~/Interfaces/GL/IAttributeManager';
import { IBufferManager } from './../../Interfaces/GL/IBufferManager';
import { IAttribBufferInfo } from './GLBuffer';

export class GLAttributes {
	public setters: { [name: string]: Function } = {};
	private numAttributes: number;

	constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
		this.numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

		for (let attributeIndex: number = 0; attributeIndex < this.numAttributes; attributeIndex++) {
			const attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(program, attributeIndex);
			if (!attributeInfo) {
				break;
			}

			const index: number = gl.getAttribLocation(program, attributeInfo.name);

			this.setters[attributeInfo.name] = this.createSetter(gl, index, attributeInfo.name);
		}
	}

	public setAttributes = (attribs: IAttribBufferInfo) => {
		console.log(attribs);
		console.log(this.setters);
		Object.keys(attribs).forEach((name: string) => {
			const setter = this.setters[name];
			console.log(setter);
			if (setter) {
				console.log(setter(attribs[name]));
				setter(attribs[name]);
			}
		});
	};

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
