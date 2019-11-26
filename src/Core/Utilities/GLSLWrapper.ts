import constants from '../../Assets/constants'

/**
 * Gets which shader the user selected and converts the GLSL file into a string from its file path
 */
export class GLSLWrapper {

	public static getShaderType = (type: string): string => {
		if (type === constants.shaderType.vertexShader) {
			return (<HTMLInputElement>document.getElementById(constants.shaderType.vertexShader)).value
		} else if (type === constants.shaderType.fragmentShader) {
			return (<HTMLInputElement>document.getElementById(constants.shaderType.fragmentShader)).value
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
