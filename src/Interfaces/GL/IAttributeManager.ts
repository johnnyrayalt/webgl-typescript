export interface IAttributeManager {
	[name: string]: {
		location: number;
		size: number;
		type: number;
		normalize: boolean;
		stride: number;
		offset: number;
	};
}
