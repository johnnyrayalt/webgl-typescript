import { ISliderBindingsManager } from '~/Interfaces/GL/ISliderBindingsManager';
import { INumHashMap } from '~/Interfaces/INumHashMap';
import { ISliderManager } from '~Interfaces/HTML/ISliderManager';
import { IObjectProperties } from '~Interfaces/IObjectProperties';

/**
 * Service for binding and holding values from HTML inputs
 */
export class InputReferences {
	uiValues: INumHashMap = {};
	sliderBindingsManager: ISliderBindingsManager = {};
	private readonly needsMath: string[] = ['colorR', 'colorG', 'colorB', 'colorW', 'scaleX', 'scaleY'];
	/**
	 * Creates an InputReference class to handle HTML bindings
	 * @this {INumHashMap} uiValues | sets defaults on slider values and used as value store for sliders
	 */
	constructor(gl: WebGLRenderingContext, sliderManager: ISliderManager, objectProperties: IObjectProperties) {
		this.uiValues = {
			colorR: sliderManager.rColor.options.value / 100,
			colorG: sliderManager.gColor.options.value / 100,
			colorB: sliderManager.bColor.options.value / 100,
			colorW: sliderManager.wColor.options.value / 100,
			positionX: (gl.canvas.width - objectProperties.width) * 0.25,
			positionY: (gl.canvas.height - objectProperties.height) * 0.25,
			angle: sliderManager.angle.options.value * 100,
			scaleX: sliderManager.scaleX.options.value / 100,
			scaleY: sliderManager.scaleY.options.value / 100,
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
			if (this.needsMath.includes(key)) {
				this.sliderBindingsManager[key].output.innerHTML = String(Math.floor(this.uiValues[key] * 100));
			} else {
				this.sliderBindingsManager[key].output.innerHTML = String(Math.floor(this.uiValues[key]));
			}
		});
	};

	public updateObject = (translation: number[], rotation: number[], scale: number[]): void => {
		if (translation[0] !== this.uiValues.positionX || translation[1] !== this.uiValues.positionY) {
			translation[0] = this.uiValues.positionX;
			translation[1] = this.uiValues.positionY;
		}

		if (scale[0] !== this.uiValues.scaleX || scale[1] !== this.uiValues.scaleY) {
			scale[0] = this.uiValues.scaleX;
			scale[1] = this.uiValues.scaleY;
		}

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
				if (this.needsMath.includes(key)) {
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
		/**
		 * HTMLInputElemets values from sliders
		 */
		const colorR: HTMLInputElement = <HTMLInputElement>document.getElementById('colorR-input');
		const colorG: HTMLInputElement = <HTMLInputElement>document.getElementById('colorG-input');
		const colorB: HTMLInputElement = <HTMLInputElement>document.getElementById('colorB-input');
		const colorW: HTMLInputElement = <HTMLInputElement>document.getElementById('colorW-input');

		const positionX: HTMLInputElement = <HTMLInputElement>document.getElementById('positionX-input');
		const positionY: HTMLInputElement = <HTMLInputElement>document.getElementById('positionY-input');

		const angle: HTMLInputElement = <HTMLInputElement>document.getElementById('angle-input');

		const scaleX: HTMLInputElement = <HTMLInputElement>document.getElementById('scaleX-input');
		const scaleY: HTMLInputElement = <HTMLInputElement>document.getElementById('scaleY-input');

		/**
		 * Value shows in DOM
		 */
		const colorRValueDiv: HTMLElement = document.getElementById('colorR-value');
		const gcolorGValueDiv: HTMLElement = document.getElementById('colorG-value');
		const colorBValueDiv: HTMLElement = document.getElementById('colorB-value');
		const colorWValueDiv: HTMLElement = document.getElementById('colorW-value');

		const positionXValueDiv: HTMLElement = document.getElementById('positionX-value');
		const positionYValueDiv: HTMLElement = document.getElementById('positionY-value');

		const angleValueDiv: HTMLElement = document.getElementById('angle-value');

		const scaleXValueDiv: HTMLElement = document.getElementById('scaleX-value');
		const scaleYValueDiv: HTMLElement = document.getElementById('scaleY-value');

		/**
		 * Slider Bindings Manager
		 */
		this.sliderBindingsManager = {
			colorR: { input: colorR, output: colorRValueDiv },
			colorG: { input: colorG, output: gcolorGValueDiv },
			colorB: { input: colorB, output: colorBValueDiv },
			colorW: { input: colorW, output: colorWValueDiv },
			positionX: { input: positionX, output: positionXValueDiv },
			positionY: { input: positionY, output: positionYValueDiv },
			angle: { input: angle, output: angleValueDiv },
			scaleX: { input: scaleX, output: scaleXValueDiv },
			scaleY: { input: scaleY, output: scaleYValueDiv },
		};
	};
}
