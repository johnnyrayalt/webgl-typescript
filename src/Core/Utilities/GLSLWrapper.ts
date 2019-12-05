import constants from '~/Assets/constants';

/**
 * Import shaders to store in memory
 * These are ts-ignored because they do not have a d.ts file
 */
// @ts-ignore
import BasicFragmentShader from '~/Core/Shaders/FragmentShaders/BasicFragmentShader.frag';
// @ts-ignore
import BasicVertexShader from '~/Core/Shaders/VertexShaders/BasicVertexShader.vert';

export const ShaderManager: any = {
	BasicVertexShader,
	BasicFragmentShader,
};

/**
 * Gets which shader the user selected and converts the GLSL file into a string from its file path
 */
export class GLSLWrapper {
	public static getShaderType = (type: string): string => {
		if (type === constants.shaderType.vertexShader) {
			return (<HTMLInputElement>document.getElementById(`${constants.shaderType.vertexShader}`)).value;
		} else if (type === constants.shaderType.fragmentShader) {
			return (<HTMLInputElement>document.getElementById(`${constants.shaderType.fragmentShader}`)).value;
		}
	};

	public static convertFilesToString = (filePaths: string[]): string[] => {
		const filesAsStrings: string[] = [];
		filePaths.forEach((filePath: string) => {
			const parseFilePath: string = filePath.slice(0, -5);
			if (parseFilePath in ShaderManager) {
				filesAsStrings.push(ShaderManager[parseFilePath]);
			}
		});

		return filesAsStrings;
	};
}
