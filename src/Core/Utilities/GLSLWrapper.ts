import * as path from 'path';

export class GLSLWrapper {

	public static getShaderType  = (type: string): string => {
		if (type === 'vertexShader') {
			return (<HTMLInputElement>document.getElementById('vertexShader')).value
		} else if (type === 'fragmentShader') {
			return (<HTMLInputElement>document.getElementById('fragmentShader')).value
		}
	};

	public static convertFilesToString = (filePaths: string[]): string[] => {

		const filesAsStrings: string[] = [];
		filePaths.forEach(filePath => {
			const fileAsString = require(`../${filePath}`).default;
			filesAsStrings.push(fileAsString);
		});
		return filesAsStrings;
	};
}
