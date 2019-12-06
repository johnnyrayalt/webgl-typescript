import constants from '~/Assets/constants';
/**
 * Import shaders to store in memory
 * These are ts-ignored because they do not have a d.ts file
 */
// @ts-ignore
import BasicFragmentShader from '~/Core/Shaders/FragmentShaders/BasicFragmentShader.frag.glsl';
// @ts-ignore
import BasicVertexShader from '~/Core/Shaders/VertexShaders/BasicVertexShader.vert.glsl';

import { IStringHashMap } from '~/Interfaces/IStringHashMap';

/**
 * List of Shaders for use
 * TODO:: This isnt very composable. can diverge easily from constants list
 */
export const ShaderManager: IStringHashMap = {
	BasicVertexShader,
	BasicFragmentShader,
};

/**
 * Gets which shader the user selected and converts the GLSL file into a string from its file path
 */
export class GLSLWrapper {
	/**
	 * Determines if the passed shader is a vertex or fragment type
	 */
	public static getShaderType = (type: string): string => {
		if (type === constants.shaderType.vertexShader) {
			return (<HTMLInputElement>document.getElementById(`${constants.shaderType.vertexShader}`)).value;
		} else if (type === constants.shaderType.fragmentShader) {
			return (<HTMLInputElement>document.getElementById(`${constants.shaderType.fragmentShader}`)).value;
		}
	};

	/**
	 * Converts GLSL files into strings
	 * @param {string[]} filePaths | Array of paths to the vertex and fragment files defined in constants
	 */
	public static convertFilesToString = (filePaths: string[]): string[] => {
		const filesAsStrings: string[] = [];

		filePaths.map((filePath: string) => {
			const parseFilePath: string = filePath.slice(0, -5);
			if (parseFilePath in ShaderManager) {
				filesAsStrings.push(ShaderManager[parseFilePath]);
			}
		});

		return filesAsStrings;
	};
}
