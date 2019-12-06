/**
 * Information for a buffers attributes
 */
export interface IAttributeInfo {
	/**
	 * The location of this attribute
	 */
	location: number;

	/**
	 * The size (number of elements) in this attribute (i.e. a vec3 = 3).
	 */
	size: number;

	/**
	 * The number of elements from the beginning of the buffer
	 */
	offset: number;
}
