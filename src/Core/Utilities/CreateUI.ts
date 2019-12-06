import constants from '~/Assets/constants';
import { IDropdownOptions } from '~/Interfaces/HTML/IDropdownOptions';
import { ISliderOptions } from '~/Interfaces/HTML/ISliderOptions';

/**
 * Stands up UI Elements
 */
export class CreateUI {
	/**
	 * Creates all of the UI elements
	 */
	public static bootStrapUI = (): void => {
		/**
		 * Set up sliders from constants
		 */
		Object.values(constants.UI.sliderGroup).forEach(group => {
			Object.values(group.slider).forEach(slider => {
				CreateUI.generateSlider(group.containerID, slider.id, {
					min: slider.min,
					step: slider.step,
					max: slider.max,
					value: slider.value,
				});
			});
		});

		/**
		 * Set up dropdowns from constants
		 */
		Object.values(constants.UI.dropdownGroup).forEach(group => {
			Object.values(group.dropdown).forEach(dropdown => {
				CreateUI.generateDropdown(group.containerID, dropdown[0].displayName, {
					shaderType: dropdown[1].shader.options.type,
					resourcePath: {
						Shader: {
							name: dropdown[1].shader.name,
							path: dropdown[1].shader.options.path,
						},
					},
				});
			});
		});
	};

	/**
	 * Gets location to generate slider and sets the inner HTML for the slider with passed options as defaults
	 * @param {string} sliderContainerID | ID of the parent container where the slider should be rendered
	 * @param {string} name | Name of the slider to be set as the ID
	 * @param {ISliderOptions} options | Set defaults
	 */
	public static generateSlider = (sliderContainerID: string, name: string, options: ISliderOptions): void => {
		const parent = document.getElementById(sliderContainerID);
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
	 * Gets location to generate dropdown and sets the inner HTML for the dropdown with passed options as defaults
	 * @param {string} dropdownContainerID | ID of the parent container where the dropdown should be rendered
	 * @param {string} name | Name of the dropdown to be set as the ID
	 * @param {IDropdownOptions} options | Set defaults
	 */
	public static generateDropdown = (dropdownContainerID: string, name: string, options: IDropdownOptions): void => {
		const parent = document.getElementById(dropdownContainerID);
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
