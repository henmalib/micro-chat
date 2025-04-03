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
