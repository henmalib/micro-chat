const esbuild = require('esbuild');

esbuild
	.build({
		platform: 'node',
		format: 'cjs',
		entryPoints: ['./src/index.ts'],
		outdir: 'dist',
		sourcemap: true,
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
