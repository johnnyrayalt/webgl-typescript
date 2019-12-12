export interface IAttributeHashMap {
	[name: string]: {
		[name: string]: {
			numComponents: number;
			data: number[];
		};
	};
}
