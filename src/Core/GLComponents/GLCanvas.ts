export class GLCanvas {
	public gl: WebGL2RenderingContext;
	public canvas: HTMLCanvasElement;

	constructor() {
		this.canvas = this.createHTMLCanvas();
		this.gl = this.createGLContext();
		this.getCanvas();
	}

	private createHTMLCanvas = (): HTMLCanvasElement => {
		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.setAttribute('id', 'c');
		document.body.appendChild(canvas);

		return canvas;
	};

	private createGLContext = (): WebGL2RenderingContext => {
		if (!this.canvas) {
			throw new Error(`Canvas context is undefined for canvas element: ${this.canvas}`);
		}

		this.gl = this.canvas.getContext('webgl2');

		if (!this.gl) {
			const canvas = document.getElementById('c');
			const errorDiv = document.createElement('div');
			const noCTXError = document.createTextNode('Sorry! It appears your browser does not support WebGL.');
			errorDiv.appendChild(noCTXError);
			document.body.insertBefore(errorDiv, canvas);
		}

		return this.gl;
	};

	public getCanvas = (): HTMLCanvasElement => {
		return this.canvas;
	};

	public getGLContext = (): WebGL2RenderingContext => {
		return this.gl;
	};

	public resize = (): void => {
		const convertToCSSPixels: number = window.devicePixelRatio;
		const client: HTMLCanvasElement = this.gl.canvas as HTMLCanvasElement;
		const displayWidth: number = Math.floor(client.clientWidth * convertToCSSPixels);
		const displayHeight: number = Math.floor(client.clientHeight * convertToCSSPixels);

		if (client.width !== displayWidth || client.height !== displayHeight) {
			client.width = displayWidth;
			client.height = displayHeight;
		}
	};

	public clearColor = (colors: [number, number, number, number]): void => {
		this.gl.clearColor(...colors);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.viewport(0, 0, 0, 0);
	};
}
