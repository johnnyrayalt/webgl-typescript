export const transformGLSL = (bundler: any): void => {
	bundler.addAssetType('glsl', require.resolve('./GLSLAsset'));
	bundler.addAssetType('vert', require.resolve('./GLSLAsset'));
	bundler.addAssetType('frag', require.resolve('./GLSLAsset'));
	bundler.addAssetType('vs', require.resolve('./GLSLAsset'));
	bundler.addAssetType('fs', require.resolve('./GLSLAsset'));
};
