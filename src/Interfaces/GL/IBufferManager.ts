import { GLBuffer } from '~/Core/GLComponents/GLBuffer';
export interface IBufferManager {
	[name: string]: GLBuffer;
}
