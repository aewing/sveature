#!/usr/bin/env node

const args = require("minimist")(process.argv.slice(2));
const [command, ...params] = args._;

switch (command) {
  case "watch":
    require("./watch").watchFeatures({ ...getConfig(), watch: true });
    break;
  case "build":
    require("./watch").writeFeatures(getConfig());
    break;
  default:
    console.log(`Invalid command: ${command}`);
}

function getConfig() {
  const configPath = require("path").resolve(
    process.cwd(),
    "sveature.config.js"
  );
  if (require("fs").existsSync(configPath)) {
    return require(configPath);
  }
  return {};
}
