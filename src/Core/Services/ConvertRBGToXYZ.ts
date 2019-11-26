export class ConvertRbgToXyz {
	public static extractRBGValues = (): number[] => {
		/**
		 * Gets the user input value for each color slider and converts it to XYZ color space
		 */
		const r: number = parseInt((<HTMLInputElement>document.getElementById('r-input')).value) / 100;
		const g: number = parseInt((<HTMLInputElement>document.getElementById('g-input')).value) / 100;
		const b: number = parseInt((<HTMLInputElement>document.getElementById('b-input')).value) / 100;
		const w: number = parseInt((<HTMLInputElement>document.getElementById('w-input')).value) / 100;

		return [r, g, b, w];
	};
}
