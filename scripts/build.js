const esbuild = require("esbuild");
const fs = require("node:fs");
const path = require("node:path");

const apps = fs.readdirSync("apps");

for (const app of apps) {
  const appPath = path.join(__dirname, "..", "apps", app);

  esbuild
    .build({
      platform: "node",
      format: "cjs",
      sourcemap: true,

      entryPoints: [`${appPath}/src/index.ts`],
      bundle: true,
      outfile: `${appPath}/dist/out.js`,
      external: ["@grpc/grpc-js", "hono", "@hono/node-server"],
    })
    .catch(() => process.exit(1));
}
