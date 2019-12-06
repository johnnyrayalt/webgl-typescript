import { ISliderBindingsManager } from '~/Interfaces/GL/ISliderBindingsManager';
import { INumHashMap } from '~/Interfaces/INumHashMap';
/**
 * Service for binding and holding values from HTML inputs
 */
export class InputReferences {
	rgbw: INumHashMap = {};
	sliderBindingsManager: ISliderBindingsManager = {};

	/**
	 * Creates an InputReference class to handle HTML bindings
	 * @this {INumHashMap} rgbw | Sets default color values to r, g, b = 50 & w = 100.
	 */
	constructor() {
		this.rgbw = { r: 50 / 100, g: 50 / 100, b: 50 / 100, w: 100 / 100 };
		this.bindSliders();
		this.setDOMSliderValues();
		this.setRGBWValues();
	}

	/**
	 * Sets innerString for slider output div
	 */
	public setDOMSliderValues = (): void => {
		Object.keys(this.sliderBindingsManager).forEach((key: string) => {
			this.sliderBindingsManager[key].output.innerHTML = String(Math.floor(this.rgbw[key] * 100));
		});
	};

	/**
	 * Binds slider input and output HTMLInputElement and HTMLElement respectively
	 * set @this sliderBindingsManager
	 */
	private bindSliders = (): void => {
		const r: HTMLInputElement = <HTMLInputElement>document.getElementById('r-input');
		const g: HTMLInputElement = <HTMLInputElement>document.getElementById('g-input');
		const b: HTMLInputElement = <HTMLInputElement>document.getElementById('b-input');
		const w: HTMLInputElement = <HTMLInputElement>document.getElementById('w-input');

		const rValueDiv: HTMLElement = document.getElementById('r-value');
		const gValueDiv: HTMLElement = document.getElementById('g-value');
		const bValueDiv: HTMLElement = document.getElementById('b-value');
		const wValueDiv: HTMLElement = document.getElementById('w-value');

		this.sliderBindingsManager = {
			r: { input: r, output: rValueDiv },
			g: { input: g, output: gValueDiv },
			b: { input: b, output: bValueDiv },
			w: { input: w, output: wValueDiv },
		};
	};

	/**
	 * Adds event listener to each slider input to listen for value changes
	 */
	private setRGBWValues = (): void => {
		Object.keys(this.sliderBindingsManager).forEach((key: string) => {
			this.sliderBindingsManager[key].input.addEventListener('input', (e: any): void => {
				this.rgbw[key] = parseInt(e.currentTarget.value) / 100;
			});
		});
	};
}
