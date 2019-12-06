/**
 * Options for standings up a new Dropdown HTMLInputElement
 */

export interface IDropdownOptions {
	shaderType: string;
	resourcePath: {
		[name: string]: {
			name: string;
			path: string;
		};
	};
}
