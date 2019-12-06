import constants from '~/Assets/constants';
import { IDropdownOptions } from '~/Interfaces/HTML/IDropdownOptions';
import { ISliderOptions } from '~/Interfaces/HTML/ISliderOptions';

/**
 * Stands up UI Elements
 */
export class CreateUI {
	/**
	 * Gets location to generate slider
	 * @param {string} sliderContainerID | ID of the parent container where the slider should be rendered
	 * @param {string} name | Name of the slider to be set as the ID
	 * @param {ISliderOptions} options | Uses interface ISliderOptions to set defaults
	 */
	public static generateSlider = (sliderContainerID: string, name: string, options: ISliderOptions): void => {
		const parent = document.getElementById(sliderContainerID);
		CreateUI.createSliderHtml(parent, name, options);
	};

	/**
	 * Creates all of the UI elements
	 */
	public static bootStrapUI = (): void => {
		/**
		 * Set up sliders
		 */
		const sliderContainerID = 'slider-container';
		CreateUI.generateSlider(sliderContainerID, 'r', { min: 0, step: 1, max: 100, value: 50 });
		CreateUI.generateSlider(sliderContainerID, 'g', { min: 0, step: 1, max: 100, value: 50 });
		CreateUI.generateSlider(sliderContainerID, 'b', { min: 0, step: 1, max: 100, value: 50 });
		CreateUI.generateSlider(sliderContainerID, 'w', { min: 0, step: 1, max: 100, value: 100 });

		/**
		 * Set up Vertex and Fragment Shader dropdown options
		 * To add more to each drop down, format new paths under options.resourcePath
		 * resourcePath: {
		 *    [resourceName: string]: { [name: string]: string, [path: string]: string },
		 *    [resourceName: string]: { [name: string]: string, [path: string]: string }
		 * }
		 */
		const dropdownContainerID = 'dropdown-container';

		/**
		 * Vertex Shader list
		 */
		CreateUI.generateDropdown(dropdownContainerID, 'Vertex Shaders', {
			shaderType: constants.shaderType.vertexShader,
			resourcePath: {
				basicVertexShader: { name: 'Basic Vertex Shader', path: constants.shaderValues.basicVertexShader },
			},
		});

		/**
		 * Fragment Shader list
		 */
		CreateUI.generateDropdown(dropdownContainerID, 'Fragment Shaders', {
			shaderType: constants.shaderType.fragmentShader,
			resourcePath: {
				basicFragmentShader: {
					name: 'Basic Fragment Shader',
					path: constants.shaderValues.basicFragmentShader,
				},
			},
		});
	};

	/**
	 * Sets the inner HTML for the slider with passed options as defaults
	 * @param {HTMLElement} parent | ID of the parent container where the slider should be rendered
	 * @param {string} name | Name of the slider to be set as the ID
	 * @param {ISliderOptions} options | Uses interface ISliderOptions to set defaults
	 */
	private static createSliderHtml = (parent: HTMLElement, name: string, options: ISliderOptions): void => {
		parent.innerHTML += `
			<div class="slider-widget-outer">
				<div class="slider-widget-label" id="${name}-label">${name}:</div>
				<input
					id="${name}-input"
					class="slider-widget"
					name="${name}"
					type="range"
					min="${options.min}"
					max="${options.max}"
					value="${options.value}"/>
				<div class="slider-widget-value" id="${name}-value">${options.value}</div>
			</div>
		`;
	};

	/**
	 * Gets location to generate dropdown
	 * @param {string} dropdownContainerID | ID of the parent container where the dropdown should be rendered
	 * @param {string} name | Name of the dropdown to be set as the ID
	 * @param {IDropdownOptions} options | Uses interface IDropdownOptions to set defaults
	 */
	public static generateDropdown = (dropdownContainerID: string, name: string, options: IDropdownOptions): void => {
		const parent = document.getElementById(dropdownContainerID);
		CreateUI.createDropdownHtml(parent, name, options);
	};

	/**
	 * Sets the inner HTML for the dropdown with passed options as defaults
	 * @param {HTMLElement} parent | ID of the parent container where the dropdown should be rendered
	 * @param {string} name | Name of the dropdown to be set as the ID
	 * @param {IDropdownOptions} options | Uses interface IDropdownOptions to set defaults
	 */
	private static createDropdownHtml = (parent: HTMLElement, name: string, options: IDropdownOptions): void => {
		parent.innerHTML += `
			<div class="dropdown-widget-outer">
				<div class="dropdown-widget-label">${name}</div>
				<select id="${options.shaderType}"></select>
			</div>
		`;

		Object.keys(options.resourcePath).forEach(resource => {
			const parent = document.getElementById(`${options.shaderType}`);
			parent.innerHTML += `
					<option value="${options.resourcePath[resource].path}">${options.resourcePath[resource].name}</option>
			`;
		});
	};
}
