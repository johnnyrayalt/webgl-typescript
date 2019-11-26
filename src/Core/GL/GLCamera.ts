// export class GLCamera {
// 	private readonly canvas: HTMLCanvasElement;
//
// 	public constructor(canvas: HTMLCanvasElement) {
// 		this.canvas = canvas;
// 	}
//
// 	public Perspective = (): void => {
// 		const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
// 		const degreeToRadians = (d: number): number => {
// 			return (d * Math.PI) / 180;
// 		};
// 		const fieldOfViewInRadians = degreeToRadians(0);
// 		const computePerspective = (fieldOfViewInRadians: number, aspect: number, near: number, far: number): number[] => {
// 			const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
// 			const rangeInView = 1.0 / (near - far);
//
// 			/**
// 			 * Conversion matrix that adjust units to be in clipspace
// 			 */
// 			return [
// 				f / aspect,
// 				0,
// 				0,
// 				0,
// 				0,
// 				f,
// 				0,
// 				0,
// 				0,
// 				0,
// 				(near + far) * rangeInView,
// 				-1,
// 				0,
// 				0,
// 				near * far * rangeInView * 2,
// 				0,
// 			];
// 		};
// 	};
// }
