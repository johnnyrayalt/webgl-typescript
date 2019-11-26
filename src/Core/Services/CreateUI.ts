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
	private static createSliderHtml = (parent: any, name: string, options: ISliderOptions): void => {
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
}
