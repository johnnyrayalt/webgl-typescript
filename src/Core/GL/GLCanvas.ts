/**
 * WebGL Rendering Context
 */
export let gl: WebGLRenderingContext;

/**
 * Responsible for setting up WebGL rendering context
 */
export class GLCanvas {
	/**
	 * Initialize WebGL with elementID if provided if it is defined
	 * @param elementId ID of the canvas element
	 */
	public static initialize = (elementId?: string): HTMLCanvasElement => {
		let canvas: HTMLCanvasElement;

		if (elementId !== undefined) {
			canvas = document.getElementById(elementId) as HTMLCanvasElement;

			if (canvas === undefined) {
				throw new Error(`Cannot fund a canvas element named: ${elementId}`);
			}
		} else {
			canvas = document.createElement('canvas') as HTMLCanvasElement;
			document.body.appendChild(canvas);
		}

		gl = canvas.getContext('webgl');

		if (gl === undefined) {
			throw new Error(`Unable to initialize WebGL`);
		}

		return canvas;
	};

	/**
	 * Resizes canvas to client width and height and sets viewport appropriately
	 * @param canvas | An HTMLCanvasElement for resizing
	 */
	public static resize = (canvas: HTMLCanvasElement): void => {
		if (canvas !== undefined) {
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;

			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;
			}

			gl.viewport(0, 0, width, height);
		}
	};
}
