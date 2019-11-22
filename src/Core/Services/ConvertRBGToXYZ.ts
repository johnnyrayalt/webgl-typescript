export class ConvertRbgToXyz {
	public static extractRBGValues = (): number[] => {
		/**
		 * Gets the user input value for each color slider and converts it to XYZ color space
		 */
		let r: number = parseInt((<HTMLInputElement>document.getElementById('r')).value) / 100;
		let g: number = parseInt((<HTMLInputElement>document.getElementById('g')).value) / 100;
		let b: number = parseInt((<HTMLInputElement>document.getElementById('b')).value) / 100;
		let w: number = parseInt((<HTMLInputElement>document.getElementById('w')).value) / 100;

		/**
		 * Returns the value to the DOM
		 */
		document.getElementById('r-value').innerHTML = r.toString();
		document.getElementById('g-value').innerHTML = g.toString();
		document.getElementById('b-value').innerHTML = b.toString();
		document.getElementById('w-value').innerHTML = w.toString();

		return [r, g, b, w];
	};
}
