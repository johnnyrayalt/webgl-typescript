const Asset = require('parcel');
import glsl from 'glslify';

export class GLSLAsset extends Asset {
	constructor(name: any, pkg: any, options: any) {
		super(name, pkg, options);
		this.type = 'js';
	}

	generate() {
		return {
			js: `module.exports = \`${glsl.compile(this.contents, {
				basedir: process.cwd(),
			})}\``,
		};
	}
}
