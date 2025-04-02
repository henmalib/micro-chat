const esbuild = require('esbuild');

esbuild
	.build({
		platform: 'node',
		format: 'cjs',

		entryPoints: ['src/index.ts'],
		bundle: true,
		outfile: 'out.js',
		external: ['@grpc/grpc-js'],
	})
	.catch(() => process.exit(1));
