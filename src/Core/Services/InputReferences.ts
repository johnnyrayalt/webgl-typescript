export class InputReferences {
	rgbw: { [name: string]: number } = {};
	sliderBindingsManager: { [name: string]: { input: HTMLInputElement; output: HTMLElement } };

	constructor() {
		this.rgbw = { r: 50 / 100, g: 50 / 100, b: 50 / 100, w: 100 / 100 };
		this.bindSliders();
		this.setDOMSliderValues();
		this.setRGBWValues();
	}

	public setDOMSliderValues = (): void => {
		Object.keys(this.sliderBindingsManager).forEach((key: string) => {
			this.sliderBindingsManager[key].output.innerHTML = String(Math.floor(this.rgbw[key] * 100));
		});
	};

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

	private setRGBWValues = (): void => {
		Object.keys(this.sliderBindingsManager).forEach((key: string) => {
			this.sliderBindingsManager[key].input.addEventListener('input', (e: any): void => {
				this.rgbw[key] = parseInt(e.currentTarget.value) / 100;
			});
		});
	};
}
