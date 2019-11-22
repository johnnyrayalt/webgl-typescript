export class ConvertRbgToXyz {
	public static extractRBGValues = (): number[] => {
		let r: number = parseInt((<HTMLInputElement>document.getElementById('r')).value) / 100;
		let g: number = parseInt((<HTMLInputElement>document.getElementById('g')).value) / 100;
		let b: number = parseInt((<HTMLInputElement>document.getElementById('b')).value) / 100;
		let w: number = parseInt((<HTMLInputElement>document.getElementById('w')).value) / 100;
		return [r, g, b, w];
	};
}
