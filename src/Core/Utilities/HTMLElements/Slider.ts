import { ISliderOptions } from '~/Interfaces/HTML/ISliderOptions';

export class Slider {
	public readonly options: ISliderOptions;
	public readonly name: string;

	constructor(name: string, sliderContainerID: string, options: ISliderOptions) {
		this.name = name;
		this.options = options;
		this.generateSlider(sliderContainerID);
	}

	/**
	 * Gets location to generate slider and sets the inner HTML for the slider with passed options as defaults
	 * @param {string} name | Name of the slider to be set as the ID
	 * @param {string} sliderContainerID | ID of the parent container where the slider should be rendered
	 * @param {ISliderOptions} options | Set defaults
	 */
	private generateSlider = (sliderContainerID: string): void => {
		const parent = document.getElementById(sliderContainerID);
		parent.innerHTML += `
			<div class="slider-widget-outer">
				<div class="slider-widget-label" id="${this.name}-label">${this.name}:</div>
				<input
					id="${this.name}-input"
					class="slider-widget"
					name="${this.name}"
					type="range"
					min="${this.options.min}"
					max="${this.options.max}"
					value="${this.options.value}"/>
				<div class="slider-widget-value" id="${this.name}-value">${this.options.value}</div>
			</div>
		`;
	};
}
