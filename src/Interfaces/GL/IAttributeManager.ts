export interface IAttributeManager {
	[name: string]: {
		index: number;
		size: number;
		type: number;
		normalize: boolean;
		stride: number;
		offset: number;
	};
}
