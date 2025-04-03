const esbuild = require('esbuild');
const { glob } = require('node:fs');
const util = require('node:util');

const gl = util.promisify(glob);

const main = async () => {
	const entryPoints = await gl('./src/**/*.ts');

	await esbuild.build({
		platform: 'node',
		format: 'cjs',
		entryPoints,
		outdir: 'dist',
		sourcemap: true,
	});
};

main();
