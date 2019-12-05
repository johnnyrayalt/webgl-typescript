import { IDropdownOptions } from '../../Interfaces/IDropdownOptions';
import { ISliderOptions } from '../../Interfaces/ISliderOptions';

/**
 * Stands up UI Elements
 */
export class CreateUI {
	/**
	 * Gets location to generate slider
	 * @param sliderContainerID | ID of the parent container where the slider should be rendered
	 * @param name | Name of the slider to be set as the ID
	 * @param options | Uses interface ISliderOptions to set defaults
	 */
	public static generateSlider = (sliderContainerID: string, name: string, options: ISliderOptions): void => {
		const parent = document.getElementById(sliderContainerID);
		CreateUI.createSliderHtml(parent, name, options);
	};

	/**
	 * Sets the inner HTML for the slider with passed options as defaults
	 * @param parent | ID of the parent container where the slider should be rendered
	 * @param name | Name of the slider to be set as the ID
	 * @param options | Uses interface ISliderOptions to set defaults
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
	 * @param dropdownContainerID | ID of the parent container where the dropdown should be rendered
	 * @param name | Name of the dropdown to be set as the ID
	 * @param options | Uses interface IDropdownOptions to set defaults
	 */
	public static generateDropdown = (dropdownContainerID: string, name: string, options: IDropdownOptions): void => {
		const parent = document.getElementById(dropdownContainerID);
		CreateUI.createDropdownHtml(parent, name, options);
	};

	/**
	 * Sets the inner HTML for the dropdown with passed options as defaults
	 * @param parent | ID of the parent container where the dropdown should be rendered
	 * @param name | Name of the dropdown to be set as the ID
	 * @param options | Uses interface IDropdownOptions to set defaults
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
