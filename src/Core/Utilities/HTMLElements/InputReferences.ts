import { ISliderBindingsManager } from '~/Interfaces/GL/ISliderBindingsManager';
import { INumHashMap } from '~/Interfaces/INumHashMap';
import { ISliderManager } from '~Interfaces/HTML/ISliderManager';
import { IObjectProperties } from '~Interfaces/IObjectProperties';

/**
 * Service for binding and holding values from HTML inputs
 */
export class InputReferences {
	public uiValues: INumHashMap = {};
	private sliderBindingsManager: ISliderBindingsManager = {};
	private readonly toBind: string[] = [];
	private readonly needsMath: string[] = ['colorR', 'colorG', 'colorB', 'colorW', 'scaleX', 'scaleY'];
	/**
	 * Creates an InputReference class to handle HTML bindings
	 * @this {INumHashMap} uiValues | sets defaults on slider values and used as value store for sliders
	 */
	constructor(gl: WebGLRenderingContext, sliderManager: ISliderManager, objectProperties: IObjectProperties) {
		this.uiValues = {
			colorR: sliderManager.colorR.options.value / 100,
			colorG: sliderManager.colorG.options.value / 100,
			colorB: sliderManager.colorB.options.value / 100,
			colorW: sliderManager.colorW.options.value / 100,
			positionX: (gl.canvas.width - objectProperties.width) * 0.25,
			positionY: (gl.canvas.height - objectProperties.height) * 0.25,
			angle: sliderManager.angle.options.value * 100,
			scaleX: sliderManager.scaleX.options.value / 100,
			scaleY: sliderManager.scaleY.options.value / 100,
		};
		Object.keys(sliderManager).forEach(key => {
			this.toBind.push(key);
		});
		this.bindSliders(this.toBind);
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

	/**
	 * Updates objects uniforms via sliders
	 * @param {number[]} translation | vertices to be multiplied against those stored in position Buffer
	 * @param {number[]} rotation | vertices to be multiplied against those stored in position Buffer
	 * @param {number[]} scale | vertices to be multiplied against those stored in position Buffer
	 */
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
	 * @param {string[]} names | Array of names to be add to bindings
	 * sets @this sliderBindingsManager
	 */
	private bindSliders = (names: string[]): void => {
		names.map(name => {
			const input: HTMLInputElement = <HTMLInputElement>document.getElementById(`${name}-input`);
			const valueDiv: HTMLElement = document.getElementById(`${name}-value`);

			this.sliderBindingsManager[name] = {
				input: input,
				output: valueDiv,
			};
		});
	};
}
