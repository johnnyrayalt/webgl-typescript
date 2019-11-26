export class ConvertRbgToXyz {
	public static extractRBGValues = (): number[] => {
		/**
		 * Gets the user input value for each color slider and converts it to XYZ color space
		 */
		const r: number = parseInt((<HTMLInputElement>document.getElementById('r-input')).value) / 100;
		const g: number = parseInt((<HTMLInputElement>document.getElementById('g-input')).value) / 100;
		const b: number = parseInt((<HTMLInputElement>document.getElementById('b-input')).value) / 100;
		const w: number = parseInt((<HTMLInputElement>document.getElementById('w-input')).value) / 100;

		/**
		 * Sends updated value back to DOM
		 */
		document.getElementById('r-value').innerHTML = `${Math.ceil(r * 100).toString()}%`;
		document.getElementById('g-value').innerHTML = `${Math.ceil(g * 100).toString()}%`;
		document.getElementById('b-value').innerHTML = `${Math.ceil(b * 100).toString()}%`;
		document.getElementById('w-value').innerHTML = `${Math.ceil(w * 100).toString()}%`;

		return [r, g, b, w];
	};
}
