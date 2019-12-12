export interface IAttributeIndexMap {
	[name: string]: {
		[name: string]: {
			numComponents: number;
			data: number[];
		};
	};
}
