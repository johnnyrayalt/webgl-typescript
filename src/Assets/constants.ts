const constants = {
	shaders: {
		type: {
			vertexShader: 'vertex-shader',
			fragmentShader: 'fragment-shader',
		},

		value: {
			basicVertexShader: 'BasicVertexShader.vert',
			basicFragmentShader: 'BasicFragmentShader.frag',
		},
	},

	UI: {
		colorSliders: {
			containerID: 'slider-container',
			slider: {
				redValue: {
					id: 'r',
					min: 0,
					step: 1,
					max: 100,
					value: 50,
				},
				blueValue: {
					id: 'g',
					min: 0,
					step: 1,
					max: 100,
					value: 50,
				},
				greenValue: {
					id: 'b',
					min: 0,
					step: 1,
					max: 100,
					value: 50,
				},
				wValue: {
					id: 'w',
					min: 0,
					step: 1,
					max: 100,
					value: 100,
				},
			},
		},
		shaderDropdown: {
			containerID: 'dropdown-container',
			dropdown: {
				vertex: {
					name: 'Vertex Shaders',
					shader: {
						get type(): string {
							return constants.shaders.type.vertexShader;
						},
						name: 'Basic Vertex Shader',
						get path(): string {
							return constants.shaders.value.basicVertexShader;
						},
					},
				},
				fragment: {
					name: 'Fragment Shaders',
					shader: {
						get type(): string {
							return constants.shaders.type.fragmentShader;
						},
						name: 'Basic Fragment Shader',
						get path(): string {
							return constants.shaders.value.basicFragmentShader;
						},
					},
				},
			},
		},
	},
};

export default constants;
