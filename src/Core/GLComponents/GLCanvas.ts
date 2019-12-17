export class GLCanvas {
	public gl: WebGLRenderingContext;

	constructor(canvasCtx: HTMLCanvasElement) {
		this.attachGLctx(canvasCtx);
	}

	private attachGLctx = (canvasCtx: HTMLCanvasElement): WebGLRenderingContext => {
		if (!canvasCtx) {
			throw new Error(`Canvas context is undefined for canvas element: ${canvasCtx}`);
		}

		this.gl = canvasCtx.getContext('webgl');
		return this.gl;
	};
}
