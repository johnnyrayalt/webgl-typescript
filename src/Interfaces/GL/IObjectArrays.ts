export interface IObjectArrays {
	[name: string]: {
		numComponents: number;
		data: number[];
		optType?:
			| Int8ArrayConstructor
			| Uint8ArrayConstructor
			| Int16ArrayConstructor
			| Uint16ArrayConstructor
			| Int32ArrayConstructor
			| Uint32ArrayConstructor
			| Float32ArrayConstructor;
	};
}
