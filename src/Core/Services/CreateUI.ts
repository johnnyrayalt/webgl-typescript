import { ISliderOptions } from '../../Interfaces/ISliderOptions';

export class CreateUI {

	public static generateSlider = (name: string, options: ISliderOptions): void => {
		CreateUI.setUpSlider('sliderContainer', name, options);
	};

	private static setUpSlider = (selector: string, name: string, options: ISliderOptions): void => {
		const parent = document.getElementById(selector);
		CreateUI.createSliderHtml(parent, name, options);
	};

	private static createSliderHtml = (parent: any, name: string, options: ISliderOptions): void => {
		parent.innerHTML += `
			<div class="slider-widget-outer">
				<div class="slider-widget-label" id="${name}-label">${name}:</div>
				<div class="slider-widget-value" id="${name}-value">${options.value}</div>
				<input
					id="${name}-input"
					class="slider-widget"
					name="${name}"
					type="${options.elementType}"
					min="${options.min}"
					max="${options.max}"
					value="${options.value}"/>
			</div>
		`;
	};

	public static updateSliderValue = (values: number[]): void => {
		document.getElementById('r-value').innerHTML = values[0].toString();
		document.getElementById('g-value').innerHTML = values[1].toString();
		document.getElementById('b-value').innerHTML = values[2].toString();
		document.getElementById('w-value').innerHTML = values[3].toString();
	};
}
