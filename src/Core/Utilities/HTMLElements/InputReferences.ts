import { ISliderBindingsManager } from '~/Interfaces/GL/ISliderBindingsManager';
import { INumHashMap } from '~/Interfaces/INumHashMap';
import { IObjectProperties } from '~Interfaces/IObjectProperties';

/**
 * Service for binding and holding values from HTML inputs
 */
export class InputReferences {
	uiValues: INumHashMap = {};
	sliderBindingsManager: ISliderBindingsManager = {};

	/**
	 * Creates an InputReference class to handle HTML bindings
	 * @this {INumHashMap} uiValues | sets defaults on slider values and used as value store for sliders
	 */
	constructor(gl: WebGLRenderingContext, sliderManager: any, objectProperties: IObjectProperties) {
		this.uiValues = {
			r: sliderManager.rColor.options.value / 100,
			g: sliderManager.gColor.options.value / 100,
			b: sliderManager.bColor.options.value / 100,
			w: sliderManager.wColor.options.value / 100,
			x: (gl.canvas.width - objectProperties.width) * 0.25,
			y: (gl.canvas.height - objectProperties.height) * 0.25,
			angle: sliderManager.angle.options.value,
		};
		this.bindSliders();
		this.setDOMSliderValues();
		this.setSliderValues();
	}

	/**
	 * Sets innerString for slider output div
	 */
	public setDOMSliderValues = (): void => {
		Object.keys(this.sliderBindingsManager).forEach((key: string): void => {
			if (key === 'r' || key === 'b' || key === 'g' || key === 'w') {
				this.sliderBindingsManager[key].output.innerHTML = String(Math.floor(this.uiValues[key] * 100));
			} else {
				this.sliderBindingsManager[key].output.innerHTML = String(Math.floor(this.uiValues[key]));
			}
		});
	};

	public updateObjectPosition = (translation: number[]): void => {
		if (translation[0] !== this.uiValues.x || translation[1] !== this.uiValues.y) {
			translation[0] = this.uiValues.x;
			translation[1] = this.uiValues.y;
		}
	};

	public updateObjectRotation = (rotation: number[]): void => {
		const angleInDegrees: number = 360 - this.uiValues.angle;
		const angleInRadians: number = (angleInDegrees * Math.PI) / 180;
		rotation[0] = Math.sin(angleInRadians);
		rotation[1] = Math.cos(angleInRadians);
	};

	/**
	 * Adds event listener to each slider input to listen for value changes
	 */
	private setSliderValues = (): void => {
		Object.keys(this.sliderBindingsManager).forEach((key: string) => {
			this.sliderBindingsManager[key].input.addEventListener('input', (e: any): void => {
				if (key === 'r' || key === 'b' || key === 'g' || key === 'w') {
					this.uiValues[key] = parseInt(e.currentTarget.value) / 100;
				} else {
					this.uiValues[key] = parseInt(e.currentTarget.value);
				}
			});
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

		const x: HTMLInputElement = <HTMLInputElement>document.getElementById('x-input');
		const y: HTMLInputElement = <HTMLInputElement>document.getElementById('y-input');

		const angle: HTMLInputElement = <HTMLInputElement>document.getElementById('angle-input');

		const rValueDiv: HTMLElement = document.getElementById('r-value');
		const gValueDiv: HTMLElement = document.getElementById('g-value');
		const bValueDiv: HTMLElement = document.getElementById('b-value');
		const wValueDiv: HTMLElement = document.getElementById('w-value');

		const xValueDiv: HTMLElement = document.getElementById('x-value');
		const yValueDiv: HTMLElement = document.getElementById('y-value');

		const angleValueDiv: HTMLElement = document.getElementById('angle-value');

		this.sliderBindingsManager = {
			r: { input: r, output: rValueDiv },
			g: { input: g, output: gValueDiv },
			b: { input: b, output: bValueDiv },
			w: { input: w, output: wValueDiv },
			x: { input: x, output: xValueDiv },
			y: { input: y, output: yValueDiv },
			angle: { input: angle, output: angleValueDiv },
		};
	};
}
