const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const glob = require("glob");
const { debounce } = require("throttle-debounce");

const DEFAULT_PATTERN = "src/components/**/features/*.svelte";

function watchFeatures({
  pattern = DEFAULT_PATTERN,
  target = "src/features/index.ts",
} = {}) {
  console.log(`Watching feature files @ ${pattern}`);
  const debounced = debounce(250, () => {
    writeFeatures(pattern, target);
  });
  chokidar.watch(pattern).on("all", debounced);
}
exports.watchFeatures = watchFeatures;

function getFeatures(pattern = DEFAULT_PATTERN) {
  return glob
    .sync(pattern)
    .map((fullPath) => fullPath.replace("src/components", "$components"));
}
exports.getFeatures = getFeatures;

function writeFeatures(
  pattern = DEFAULT_PATTERN,
  target = "src/features/index.ts"
) {
  console.log(`Updating ${target}...`);
  const features = getFeatures(pattern);
  fs.writeFileSync(
    path.resolve(process.cwd(), target),
    `export default [${features.map((feature) => `import("${feature}")`)}];`
  );
}
exports.writeFeatures = writeFeatures;
