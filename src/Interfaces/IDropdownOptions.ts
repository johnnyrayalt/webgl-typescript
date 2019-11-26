export interface IDropdownOptions {
	shaderType: string;
	resourcePath: {
		[name: string]: {
			name: string,
			path: string
		}
	};
}
