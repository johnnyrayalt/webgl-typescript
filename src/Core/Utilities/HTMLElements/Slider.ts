import { ISliderOptions } from '~Interfaces/HTML/ISliderOptions';

export class Slider {
	constructor(name: string, sliderContainerID: string, options: ISliderOptions) {
		this.generateSlider(name, sliderContainerID, options);
	}
	/**
	 * Gets location to generate slider and sets the inner HTML for the slider with passed options as defaults
	 * @param {string} name | Name of the slider to be set as the ID
	 * @param {string} sliderContainerID | ID of the parent container where the slider should be rendered
	 * @param {ISliderOptions} options | Set defaults
	 */
	private generateSlider = (name: string, sliderContainerID: string, options: ISliderOptions): void => {
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
}
