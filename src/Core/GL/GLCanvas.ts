import { GLBuffer } from '~/Core/GL/GLBuffer';

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
	 * Resize canvas to client width and height and sets viewport appropriately
	 * @param canvas | An HTMLCanvasElement for resizing
	 * @param multiplier | Amount to be multiplied by
	 */
	private static resize = (canvas: HTMLCanvasElement, multiplier?: number): boolean => {
		multiplier = multiplier || 1;
		if (canvas !== undefined) {
			const width = (canvas.clientWidth * multiplier) | 0;
			const height = (canvas.clientHeight * multiplier) | 0;

			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;
				return true;
			}
			return false;
		}
	};

	/**
	 * Checks to see if the window and/or canvas is resized, then tells the DOM to recompute the new size
	 * @param canvas | HTMLCanvasElement with GL context
	 * @param buffer | Current buffer of type GLBuffer
	 */
	public static checkRender = (canvas: HTMLCanvasElement, buffer: GLBuffer): void => {
		let needToRender = true;
		const checkRender = (): void => {
			if (GLCanvas.resize(canvas) || needToRender) {
				needToRender = false;
				buffer.draw();
			}
			requestAnimationFrame(checkRender);
		};
		checkRender();
	};
}
