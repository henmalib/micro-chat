/**
 * Copyright (C) 2025  henmalib
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
