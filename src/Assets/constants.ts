import { Schema } from '~/Assets/Schema';
const constants: Schema = {
	shaders: {
		type: {
			vertexShader: 'vertex-shader',
			fragmentShader: 'fragment-shader',
		},

		value: {
			basicVertexShader: 'BasicVertexShader.vert',
			basicFragmentShader: 'BasicFragmentShader.frag',
		},

		attributes: {
			position: 'a_position',
		},

		uniforms: {
			color: 'u_color',
			resolution: 'u_resolution',
		},
	},

	UI: {
		sliderGroup: {
			colors: {
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
		},
		dropdownGroup: {
			shaders: {
				containerID: 'dropdown-container',
				dropdown: {
					vertex: [
						{
							displayName: 'Vertex Shaders',
						},
						{
							shader: {
								name: 'Basic Vertex Shader',
								options: {
									get type(): string {
										return constants.shaders.type.vertexShader;
									},
									get path(): string {
										return constants.shaders.value.basicVertexShader;
									},
								},
							},
						},
					],
					fragment: [
						{
							displayName: 'Fragment Shaders',
						},
						{
							shader: {
								name: 'Basic Fragment Shader',
								options: {
									get type(): string {
										return constants.shaders.type.fragmentShader;
									},
									get path(): string {
										return constants.shaders.value.basicFragmentShader;
									},
								},
							},
						},
					],
				},
			},
		},
	},
};

export default constants;
