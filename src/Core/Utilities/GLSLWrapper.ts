/**
 * Gets which shader the user selected and converts the GLSL file into a string from its file path
 */
export class GLSLWrapper {

	public static getShaderType = (type: string): string => {
		if (type === 'vertex-shader') {
			return (<HTMLInputElement>document.getElementById('vertex-shader')).value
		} else if (type === 'fragment-shader') {
			return (<HTMLInputElement>document.getElementById('fragment-shader')).value
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
