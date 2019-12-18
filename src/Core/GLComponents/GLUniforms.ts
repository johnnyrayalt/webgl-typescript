export class GLUniforms {
	public uniformSetters: { [name: string]: Function } = {};
	private numUniforms: number;

	constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
		this.numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

		for (let uniformIndex: number = 0; uniformIndex < this.numUniforms; uniformIndex++) {
			const uniformInfo = gl.getActiveUniform(program, uniformIndex);
			if (!uniformInfo) {
				break;
			}

			let name = uniformInfo.name;
			if (name.substr(-3) === '[0]') {
				name = name.substr(0, name.length - 3);
			}

			const setter = this.createSetter(gl, program, uniformInfo, uniformIndex);
			this.uniformSetters[name] = setter;
		}
	}

	private createSetter = (
		gl: WebGLRenderingContext,
		program: WebGLProgram,
		uniformInfo: WebGLActiveInfo,
		uniformIndex: number,
	): Function => {
		const location: WebGLActiveInfo = gl.getActiveUniform(program, uniformIndex);
		const type: number = uniformInfo.type;
		const isArray: boolean = uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]';

		let textureUnit: number = 0;

		switch (type) {
			case gl.FLOAT: {
				if (isArray) {
					return (v: Float32List) => {
						gl.uniform1fv(location, v);
					};
				} else {
					return (v: number) => {
						gl.uniform1f(location, v);
					};
				}
			}
			case gl.FLOAT_VEC2: {
				return (v: Float32List) => {
					gl.uniform2fv(location, v);
				};
			}
			case gl.FLOAT_VEC3: {
				return (v: Float32List) => {
					gl.uniform3fv(location, v);
				};
			}
			case gl.FLOAT_VEC4: {
				return (v: Float32List) => {
					gl.uniform4fv(location, v);
				};
			}
			case gl.INT: {
				if (isArray) {
					return (v: Int32List) => {
						gl.uniform1iv(location, v);
					};
				} else {
					return (v: number) => {
						gl.uniform1i(location, v);
					};
				}
			}
			case gl.INT_VEC2 || gl.BOOL_VEC2: {
				return (v: Int32List) => {
					gl.uniform2iv(location, v);
				};
			}
			case gl.INT_VEC3 || gl.BOOL_VEC3: {
				return (v: Int32List) => {
					gl.uniform3iv(location, v);
				};
			}
			case gl.INT_VEC4 || gl.BOOL_VEC4: {
				return (v: Int32List) => {
					gl.uniform4iv(location, v);
				};
			}
			case gl.BOOL: {
				return (v: Int32List) => {
					gl.uniform1iv(location, v);
				};
			}
			case gl.FLOAT_MAT2: {
				return (v: Float32List) => {
					gl.uniformMatrix2fv(location, false, v);
				};
			}
			case gl.FLOAT_MAT3: {
				return (v: Float32List) => {
					gl.uniformMatrix3fv(location, false, v);
				};
			}
			case gl.FLOAT_MAT4: {
				return (v: Float32List) => {
					gl.uniformMatrix4fv(location, false, v);
				};
			}
			case gl.SAMPLER_2D || gl.SAMPLER_CUBE: {
				if (isArray) {
					const units: number[] = [];
					for (let i: number = 0; i < uniformInfo.size; i++) {
						units.push(textureUnit++);
					}
					return ((bindPoint: number, units: number[]) => {
						return (textures: number[]) => {
							gl.uniform1iv(location, units);
							textures.forEach((texture, index: number) => {
								gl.activeTexture(gl.TEXTURE0 + units[index]);
								gl.bindTexture(bindPoint, texture);
							});
						};
					})(this.getBindPointsForSamplerType(gl, type), units);
				} else {
					return ((bindPoint: number, unit: number) => {
						return (texture: number) => {
							gl.uniform1i(location, unit);
							gl.activeTexture(gl.TEXTURE0 + unit);
							gl.bindTexture(bindPoint, texture);
						};
					})(this.getBindPointsForSamplerType(gl, type), textureUnit++);
				}
			}
			default: {
				throw new Error(`unknown type: 0x ${type.toString(16)}`);
			}
		}
	};

	private getBindPointsForSamplerType = (gl: WebGLRenderingContext, type: number): number => {
		switch (type) {
			case gl.SAMPLER_2D: {
				return gl.TEXTURE_2D;
			}
			case gl.SAMPLER_CUBE: {
				return gl.TEXTURE_CUBE_MAP;
			}
			default: {
				throw new Error(`Supplied type: ${type} is not valid`);
			}
		}
	};
}
