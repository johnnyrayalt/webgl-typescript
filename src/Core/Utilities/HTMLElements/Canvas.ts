/**
 * Creates and returns Canvas HTMLCanvasElement
 */
export class Canvas {
	public canvas: HTMLCanvasElement;

	constructor() {
		this.canvas = this.createHTMLCanvas();
		this.getCanvas();
	}

	private createHTMLCanvas = (elementId?: string): HTMLCanvasElement => {
		let canvas: HTMLCanvasElement;

		if (elementId !== undefined) {
			canvas = document.getElementById(elementId) as HTMLCanvasElement;
			if (canvas === undefined) {
				throw new Error(`Cannot find elementID of name: ${elementId}`);
			}
		} else {
			canvas = document.createElement('canvas') as HTMLCanvasElement;
			document.body.appendChild(canvas);
		}

		return canvas;
	};

	private getCanvas = (): HTMLCanvasElement => {
		return this.canvas;
	};

	public static resize = (gl: WebGLRenderingContext): void => {
		const convertToCSSPixels: number = window.devicePixelRatio;
		const client: HTMLCanvasElement = gl.canvas as HTMLCanvasElement;
		const displayWidth: number = Math.floor(client.clientWidth * convertToCSSPixels);
		const displayHeight: number = Math.floor(client.clientHeight * convertToCSSPixels);

		if (client.width !== displayWidth || client.height !== displayHeight) {
			client.width = displayWidth;
			client.height = displayHeight;
		}
	};

	// /**
	//  * Gets location to generate dropdown and sets the inner HTML for the dropdown with passed options as defaults
	//  * @param {string} dropdownContainerID | ID of the parent container where the dropdown should be rendered
	//  * @param {string} name | Name of the dropdown to be set as the ID
	//  * @param {IDropdownOptions} options | Set defaults
	//  */
	// public static generateDropdown = (dropdownContainerID: string, name: string, options: IDropdownOptions): void => {
	// 	const parent = document.getElementById(dropdownContainerID);
	// 	parent.innerHTML += `
	// 		<div class="dropdown-widget-outer">
	// 			<div class="dropdown-widget-label">${name}</div>
	// 			<select class="dropdown-widget-select" id="${options.shaderType}"></select>
	// 		</div>
	// 	`;

	// 	Object.keys(options.resourcePath).forEach(resource => {
	// 		const parent = document.getElementById(`${options.shaderType}`);
	// 		parent.innerHTML += `
	// 				<option value="${options.resourcePath[resource].path}">${options.resourcePath[resource].name}</option>
	// 		`;
	// 	});
	// };
}
