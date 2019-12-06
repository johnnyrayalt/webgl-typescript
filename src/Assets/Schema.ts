export interface Schema {
	shaders: {
		[attribute: string]: {
			[name: string]: string;
		};
	};
	UI: {
		sliderGroup: {
			[groupName: string]: {
				containerID: string;
				slider: {
					[name: string]: {
						id: string;
						min: number;
						step: number;
						max: number;
						value: number;
					};
				};
			};
		};
		dropdownGroup: {
			[groupName: string]: {
				containerID: string;
				dropdown: {
					[dropdownName: string]: [
						{ displayName: string },
						{
							[optionsGroup: string]: {
								name: string;
								options: {
									readonly [option: string]: string | (() => string);
								};
							};
						},
					];
				};
			};
		};
	};
}
