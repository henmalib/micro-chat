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
const fs = require('node:fs');
const path = require('node:path');

const apps = fs.readdirSync('apps');

const collectSharedPackages = () => {
	const sharedPath = path.join(__dirname, '..', 'shared');
	const sharedApps = fs.readdirSync(sharedPath).map((name) => {
		const packagePath = path.join(sharedPath, name, 'package.json');
		const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
		return pkg.name;
	});

	return sharedApps;
};

const collectAllPackages = () => {
	const appPath = path.join(__dirname, '..', 'apps');
	const deps = fs.readdirSync(appPath).flatMap((name) => {
		const packagePath = path.join(appPath, name, 'package.json');
		const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
		return Object.keys(pkg.dependencies || []);
	});

	return [...new Set(deps)];
};

const shared = collectSharedPackages();
const external = collectAllPackages().filter((pkg) => !shared.includes(pkg));

const main = async () => {
	for (const app of apps) {
		const appPath = path.join(__dirname, '..', 'apps', app);
		const exists = fs.existsSync(path.join(appPath, 'src', 'index.ts'));

		if (!exists) continue;

		await esbuild
			.build({
				platform: 'node',
				format: 'cjs',
				sourcemap: true,

				entryPoints: [`${appPath}/src/index.ts`],
				bundle: true,
				outfile: `${appPath}/dist/index.js`,
				external,
			})
			.catch(() => process.exit(1));
	}
};
main();
