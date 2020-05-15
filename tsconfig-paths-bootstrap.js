const tsConfig = require("./tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");

tsConfigPaths.register({
  baseUrl: './build',
  paths: tsConfig.compilerOptions.paths
});
